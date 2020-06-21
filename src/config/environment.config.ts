import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  MONGO_DB: process.env.MONGO_DB,
};
