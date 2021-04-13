import {
  ShowListItem,
  ShowListSortBy,
  SortDirection,
} from '@tagesschau-analyzer/core/types';

export interface ShowListStateModel {
  inProgress: boolean;

  limit: number;
  offset: number;
  sortBy: ShowListSortBy;

  count: number;
  shows: ShowListItem[];
}

export namespace ShowListActions {
  export class Load {
    static readonly type = '[Show List] Load';
  }

  export class SetPage {
    static readonly type = '[Show List] Set Page';
    constructor(public payload: { pageIndex: number; pageSize: number }) {}
  }

  export class SetSort {
    static readonly type = '[Show List] Set Sort';
    constructor(public payload: { key: string; direction: SortDirection }) {}
  }
}
