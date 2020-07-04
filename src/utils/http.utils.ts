import https from 'https';
import parser from 'fast-xml-parser';
import { LogClient } from './log.utils';

export class HttpClient {
  private logger: LogClient;

  constructor(logClient: LogClient) {
    this.logger = logClient;
  }

  get(queryUrl: string) {
    return new Promise((resolve, reject) => {
      const req = https.get(queryUrl, (res: any) => {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
          this.logger.error('HttpClient.get', {
            code: res.statusCode,
            query: queryUrl,
          });
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
            this.logger.error('HttpClient.get', error);
            resolve(false);
          }

          resolve(json);
        });
      });

      req.on('error', (error: any) => {
        this.logger.error('HttpClient.get', error);
        reject(error);
      });
    });
  }
}
