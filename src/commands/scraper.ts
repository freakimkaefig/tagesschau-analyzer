import moment, { Moment } from 'moment';

import { times, airtimes } from '../config/show.config';

import { HttpClient } from '../utils/http.utils';
import { MongoClient } from '../utils/mongo.utils';
import { IShowDocument, IShow } from 'models/show.model';

export class ScrapeCommand {
  private httpClient: HttpClient;
  private mongoClient: MongoClient;

  constructor() {
    this.httpClient = new HttpClient();
    this.mongoClient = new MongoClient();
  }

  public async run(): Promise<void> {
    const connection = this.mongoClient.connect();

    const now = moment().subtract(2, 'hours');

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

            // Iterate over diff days
            for (let i = 0; i < diff; i++) {
              date.add(1, 'days');
              const dow = date.day();

              // Lookup if time is broadcasted on defined day
              if (airtimes[dow].times.includes(show.time)) {
                // temporary time object for comparison
                const tempShowTime = moment(
                  now.format('YYYY-MM-DD ' + show.time),
                  'YYYY-MM-DD HH-mm'
                );

                // Check if show time has already been broadcasted today
                if (now > tempShowTime) {
                  // scrape show
                  promises.push(
                    this.scrapeShow(
                      idCounter + 2,
                      show.time,
                      moment(date.toISOString())
                    )
                  );

                  // increase show counter
                  idCounter += 2;
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
          promises.push(this.mongoClient.addShow(show));
        });

        return Promise.all(promises);
      })
      .then((result: IShow[]) => {
        // TODO: log result to logfile

        if (!result.length) {
          console.log('No new shows added!');
        }
        result.forEach((show: IShow) => {
          console.log(
            `Added show from ${moment(show.date).format('YYYY-MM-DD')} ${
              show.time
            } (${show.showId})`
          );
        });
      })
      .catch((error: { type: string; code?: number; query?: string }) => {
        if (error.type === 'http') {
          console.warn(error.code, error.query);
        } else {
          console.error(error);
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

    return this.httpClient
      .get(url)
      .then((data: any) => {
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
          date: date,
          time: time,
          showId: id,
          ut: false,
        };

        if (data) {
          show.ut = true;
          show.text = this.traverse(
            data['tt:tt']['tt:body']['tt:div']['tt:p']
          ).join('\n');
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
