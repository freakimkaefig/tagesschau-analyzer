import moment, { Moment } from 'moment';

import { times, airtimes } from '../config/show.config';

import { LogClient } from '../utils/log.utils';
import { HttpClient } from '../utils/http.utils';
import { MongoClient } from '../utils/mongo.utils';
import { IShowDocument, IShow } from 'models/show.model';

export class ScrapeCommand {
  private logger: LogClient;
  private httpClient: HttpClient;
  private mongoClient: MongoClient;

  constructor() {
    this.logger = new LogClient();

    this.httpClient = new HttpClient(this.logger);
    this.mongoClient = new MongoClient(this.logger);
  }

  public async run(): Promise<void> {
    this.logger.log('ScrapeCommand.run:23', `Start scraping ...`);
    const connection = this.mongoClient.connect();

    const now = moment().add(1, 'day');

    connection
      .then(() => {
        const promises: Promise<IShowDocument[]>[] = [];

        // Load last shows for all times
        times.forEach((showTime: string) => {
          promises.push(this.mongoClient.getLastShow(showTime));
        });

        return Promise.all(promises);
      })
      .then((result: Array<IShowDocument[]>) => {
        const promises: Promise<IShow>[] = [];

        result.forEach(shows => {
          if (shows.length) {
            const show = shows[0];
            const date = moment(show.date);

            // Calculate days between today and last show
            const diff = now.diff(date, 'days');

            // Set show id to last id
            let idCounter = show.showId;
            this.logger.log(
              'ScrapeCommand.run:53',
              `Retrieved last id for show time ${show.time}: ${
                show.showId
              } (${moment(show.date).format('YYYY-MM-DD')} - ${diff})`
            );

            // Iterate over diff days
            for (let i = 1; i < diff; i++) {
              date.add(1, 'days');
              const dow = date.day();

              // Lookup if time is broadcasted on defined day
              if (airtimes[dow].times.includes(show.time)) {
                // temporary time object for comparison
                const tempShowTime = moment(
                  moment(show.date).format('YYYY-MM-DD') + ' ' + show.time,
                  'YYYY-MM-DD HH-mm'
                );

                // Check if show time has already been broadcasted today
                if (now > tempShowTime) {
                  // increase show counter
                  idCounter += 2;

                  // scrape show
                  promises.push(
                    this.scrapeShow(
                      idCounter,
                      show.time,
                      moment(date.toISOString())
                    )
                  );

                  this.logger.log(
                    'ScrapeCommand.run:87',
                    `Enqueued show at ${show.time} (${idCounter}) from ${moment(
                      date.toISOString()
                    ).format('YYYY-MM-DD')} for scraping`
                  );
                }
              }
            }
          }
        });

        // return scraped show data
        return Promise.all(promises);
      })
      .then((result: IShow[]) => {
        const promises: Promise<any>[] = [];
        // iterate over results
        result.forEach(show => {
          // add show to database
          if (show.ut) {
            promises.push(this.mongoClient.addShow(show));
          }

          this.logger.log(
            'ScrapeCommand.run:111',
            `Enqueued show at ${show.time} (${show.showId}) from ${moment(
              show.date
            ).format('YYYY-MM-DD')} for saving to database`
          );
        });

        return Promise.all(promises);
      })
      .then((result: IShow[]) => {
        // TODO: log result to logfile

        if (!result.length) {
          this.logger.log('ScrapeCommand.run:125', 'No new shows added!');
        }
        result.forEach((show: IShow) => {
          this.logger.log(
            'ScrapeCommand.run:128',
            `Added show from ${moment(show.date).format('YYYY-MM-DD')} ${
              show.time
            } (${show.showId}) to database`
          );
        });
      })
      .catch(error => {
        if (error.type === 'http') {
          this.logger.error('ScrapeCommand.run:138', error);
        } else {
          this.logger.error('ScrapeCommand.run:140', error);
        }
      })
      .finally(() => {
        this.mongoClient.disconnect();
      });
  }

  /**
   *
   * @param id the show id
   * @param time the show time (e.g. '20-00')
   */
  private async scrapeShow(
    id: number,
    time: string,
    date: Moment
  ): Promise<IShow> {
    const url = `https://www.daserste.de/information/nachrichten-wetter/tagesschau/videosextern/tagesschau-${time}-uhr-${id}~playerXml.xml`;
    let showDate = date;

    return this.httpClient
      .get(url)
      .then((data: any) => {
        if (
          data &&
          data.playlist &&
          data.playlist.video &&
          data.playlist.video.broadcastDate
        ) {
          showDate = moment(data.playlist.video.broadcastDate);
        }

        if (
          data &&
          data.playlist &&
          data.playlist.video &&
          data.playlist.video.dataTimedText &&
          data.playlist.video.dataTimedText['@_url']
        ) {
          return this.httpClient.get(
            data.playlist.video.dataTimedText['@_url']
          );
        }

        return Promise.resolve(false);
      })
      .then((data: any) => {
        let show: any = {
          date: showDate,
          time: time,
          showId: id,
          ut: false,
        };

        if (data) {
          show.ut = true;
          const traversedText = this.traverse(
            data['tt:tt']['tt:body']['tt:div']['tt:p']
          );
          if (traversedText) {
            show.text = traversedText.join('\n');
          } else {
            return Promise.resolve(false);
          }
        }

        return Promise.resolve(show);
      });
  }

  private traverse(tree: any): any {
    if (tree['#text']) {
      return tree['#text'];
    }

    if (Array.isArray(tree)) {
      return tree.map((subTree: any) => {
        return this.traverse(subTree);
      });
    }

    if (tree['tt:span']) {
      return this.traverse(tree['tt:span']);
    }
  }
}
