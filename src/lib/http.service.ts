import https from 'https';
import parser from 'fast-xml-parser';

export class HttpClient {
  constructor() {}

  get(queryUrl: string) {
    return new Promise((resolve, reject) => {
      const req = https.get(queryUrl, (res: any) => {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error('statusCode=' + res.statusCode));
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
            reject(error);
          }

          resolve(json);
        });
      });

      req.on('error', (error: any) => {
        reject(error);
      });
    });
  }
}
