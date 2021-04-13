import { SortDirection } from '../core.type';

export interface ShowListItem {
  date: Date;
  time: string;

  text: string;
}

export interface ShowListSortBy {
  key: string;
  direction: SortDirection;
}

export interface ShowListResponse {
  count: number;
  shows: ShowListItem[];
}
