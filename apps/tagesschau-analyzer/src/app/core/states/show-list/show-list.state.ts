import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {
  ShowListItem,
  ShowListResponse,
  ShowListSortBy,
} from '@tagesschau-analyzer/core/types';

import { ShowListActions, ShowListStateModel } from './show-list.actions';
import { ShowService } from '../../services/show.service';

@State<ShowListStateModel>({
  name: 'showList',
  defaults: {
    inProgress: false,

    limit: 25,
    offset: 0,
    sortBy: {
      key: 'date',
      direction: 'desc',
    },

    count: null,
    shows: null,
  },
})
@Injectable()
export class ShowListState {
  @Selector()
  static inProgress(state: ShowListStateModel): boolean {
    return state.inProgress;
  }

  @Selector()
  static limit(state: ShowListStateModel): number {
    return state.limit;
  }

  @Selector()
  static sortBy(state: ShowListStateModel): ShowListSortBy {
    return state.sortBy;
  }

  @Selector()
  static count(state: ShowListStateModel): number {
    return state.count;
  }

  @Selector()
  static shows(state: ShowListStateModel): ShowListItem[] {
    return state.shows;
  }

  constructor(private showService: ShowService) {}

  @Action(ShowListActions.Load)
  @ImmutableContext()
  load(ctx: StateContext<ShowListStateModel>) {
    const { limit, offset, sortBy } = ctx.getState();

    ctx.setState((state: ShowListStateModel) => {
      state.inProgress = true;
      return state;
    });

    return this.showService.getShowList(limit, offset, sortBy).pipe(
      tap(({ count, shows }: ShowListResponse) => {
        ctx.setState((state: ShowListStateModel) => {
          state.inProgress = false;
          state.count = count;
          state.shows = shows;
          return state;
        });
      }),
      catchError((error) => {
        console.error(error);

        return of(error);
      })
    );
  }

  @Action(ShowListActions.SetPage)
  @ImmutableContext()
  setLimit(
    ctx: StateContext<ShowListStateModel>,
    { payload }: ShowListActions.SetPage
  ) {
    const { pageIndex, pageSize } = payload;

    ctx.setState((state: ShowListStateModel) => {
      state.limit = pageSize;
      state.offset = pageIndex * pageSize;
      return state;
    });

    return ctx.dispatch(new ShowListActions.Load());
  }

  @Action(ShowListActions.SetSort)
  @ImmutableContext()
  setSort(
    ctx: StateContext<ShowListStateModel>,
    { payload }: ShowListActions.SetSort
  ) {
    const { key, direction } = payload;

    ctx.setState((state: ShowListStateModel) => {
      state.sortBy.key = key;
      state.sortBy.direction = direction;
      return state;
    });

    return ctx.dispatch(new ShowListActions.Load());
  }
}
