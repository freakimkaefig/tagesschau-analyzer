import https from 'https';
import parser from 'fast-xml-parser';
import moment from 'moment';

export class HttpClient {
  get(queryUrl: string) {
    return new Promise((resolve, reject) => {
      const req = https.get(queryUrl, (res: any) => {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
          console.warn(`${moment().format()}:`, res.statusCode, queryUrl);
          resolve(false);
        }

        // cumulate data
        let json = {};
        let xml = '';

        res.on('data', (data: any) => {
          xml += data;
        });

        // resolve on end
        res.on('end', () => {
          try {
            json = parser.parse(xml, { ignoreAttributes: false });
          } catch (error) {
            console.error(`${moment().format()}:`, error);
            resolve(false);
          }

          resolve(json);
        });
      });

      req.on('error', (error: any) => {
        console.error('HttpService.get', 'CONNECTION_ERROR', error);
        reject(error);
      });
    });
  }
}
