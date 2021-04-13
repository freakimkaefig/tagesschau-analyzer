import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SortDirection } from '@tagesschau-analyzer/core/types';

import { Show, ShowDocument } from '../schema/show.schema';

@Injectable()
export class ShowService {
  constructor(@InjectModel(Show.name) private showModel: Model<ShowDocument>) {}

  async getCount(): Promise<number> {
    return await this.showModel.countDocuments();
  }

  async getShows(
    limit = 50,
    offset = 0,
    sortKey: string,
    sortDirection: SortDirection
  ): Promise<Show[]> {
    return await this.showModel
      .find({})
      .limit(limit)
      .skip(offset)
      .sort({
        [sortKey]: sortDirection,
      })
      .lean();
  }

  async getLastShow(time: string): Promise<Show> {
    return await this.showModel
      .findOne({
        time: time,
      })
      .sort({
        showId: -1,
      })
      .lean<Show>();
  }

  async addShow(
    date: Date,
    time: string,
    showId: number,
    ut: boolean,
    text: string
  ) {
    const show = new this.showModel({
      date,
      time,
      showId,
      ut,
      text,
    });
    return show.save();
  }
}
