import { DateTime } from 'luxon';
import axios from 'axios';
import * as parser from 'fast-xml-parser';

import { Show } from '@tagesschau-analyzer/api/mongodb';

import { AIRTIMES, TIMES } from '../config/scraper.config';
import { MongoClient } from '../utils/mongo.utils';

export class Scraper {
  private mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient();
  }

  async run(): Promise<void> {
    const now = DateTime.now();

    for (let i = 0; i < TIMES.length; i++) {
      const lastShow = await this.mongoClient.getLastShow(TIMES[i]);
      let date = DateTime.fromJSDate(lastShow.date);
      const diff = now.diff(date, 'days').toObject();

      // Set show id to last id
      let idCounter = lastShow.showId;

      for (let j = 0; j < Math.floor(diff.days); j++) {
        date = date.plus({ days: 1 });

        if (AIRTIMES[date.weekday - 1].times.includes(lastShow.time)) {
          const tempShowTime = DateTime.fromJSDate(lastShow.date);

          if (now > tempShowTime) {
            idCounter += 2;

            console.log('scrape show', idCounter, lastShow.time, date.toISO());

            const show = await this.scrapeShow(idCounter, lastShow.time, date);
            if (show) {
              await this.mongoClient.addShow(show);
            }
          }
        }
      }
    }

    return await this.finalize();
  }

  async finalize(): Promise<void> {
    return await this.mongoClient.disconnect();
  }

  private async scrapeShow(
    showId: number,
    time: string,
    date: DateTime
  ): Promise<Show> {
    let showDate = date;

    try {
      const showResponse = await axios.get(
        `https://www.daserste.de/information/nachrichten-wetter/tagesschau/videosextern/tagesschau-${time}-uhr-${showId}~playerXml.xml`
      );
      const showData = parser.parse(showResponse.data, {
        ignoreAttributes: false,
      });

      if ((((showData || {}).playlist || {}).video || {}).broadcastDate) {
        showDate = DateTime.fromISO(showData.playlist.video.broadcastDate);
      }

      const subtitleResponse = await axios.get(
        showData.playlist.video.dataTimedText['@_url']
      );
      const subtitleData = parser.parse(subtitleResponse.data, {
        ignoreAttributes: false,
      });

      if (!subtitleData) {
        return;
      }

      const subtitleText = this.traverse(
        subtitleData['tt:tt']['tt:body']['tt:div']['tt:p']
      );

      return {
        date: showDate.toJSDate(),
        time,
        showId,
        ut: true,
        text: subtitleText.join('\n'),
      };
    } catch (error) {
      // Ignore errors for now, blame daserste.de
      console.error(error);
    }
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
