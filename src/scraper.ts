import * as fs from 'fs';
import * as path from 'path';
import moment, { Moment } from 'moment';

import { airtimes } from './config/show.config';

import { LogService } from './lib/log.service';
import { HttpClient } from './lib/http.service';
import { MongoService } from './lib/mongo.service';

// import { ShowModel } from './models/show.model';

export class Scraper {
  logger: LogService;
  http: HttpClient;
  mongo: MongoService;

  constructor() {
    this.logger = new LogService();
    this.http = new HttpClient();
    this.mongo = new MongoService();
  }

  public start() {
    this.mongo.connect();

    try {
      const statusPath = path.join(__dirname, './data/status.json');

      if (fs.existsSync(statusPath)) {
        // TODO: get status from db
        const rawStatus = fs.readFileSync(statusPath);
        const status = JSON.parse(rawStatus.toString());

        const date = moment('2020-06-15');
        const dow = date.day();

        // loop over configured airtimes for current weekday
        airtimes[dow].times.forEach((showTime: string) => {
          const showId = status[showTime];

          this.scrapeShow(showId, showTime, date, this.writeFile);

          // TODO: write status
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * @param id the show id
   * @param time the show time (e.g. '20-00')
   * @param date the show date
   * @param text the subtitle text
   */
  private writeFile(id: number, time: string, date: Moment, text: string) {
    const directory = path.join(
      __dirname,
      './data/',
      `${date.format('YYYY-MM-DD')}`
    );

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeFile(
      path.join(directory, `${time}-${id}.json`),
      JSON.stringify({
        id: id,
        time: time,
        text: text,
      }),
      error => {
        if (error) throw error;
      }
    );
  }

  /**
   *
   * @param id the show id
   * @param time the show time (e.g. '20-00')
   */
  private scrapeShow(
    id: number,
    time: string,
    date: Moment,
    cb: (id: number, time: string, date: Moment, text: string) => void
  ) {
    const url = `https://www.daserste.de/information/nachrichten-wetter/tagesschau/videosextern/tagesschau-${time}-uhr-${id}~playerXml.xml`;

    this.http.get(url).then((data: any) => {
      const subtitleUrl = data.playlist.video.dataTimedText['@_url'];

      this.http.get(subtitleUrl).then((data: any) => {
        const text = this.traverse(data['tt:tt']['tt:body']['tt:div']['tt:p']);
        cb(id, time, date, text.join('\n'));
      });
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
