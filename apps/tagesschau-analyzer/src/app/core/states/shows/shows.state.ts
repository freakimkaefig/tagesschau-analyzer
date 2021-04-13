import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ShowsActions, ShowsStateModel } from './shows.actions';
import { ShowService } from '../../services/show.service';

@State<ShowsStateModel>({
  name: 'shows',
  defaults: {
    inProgress: false,
    count: null,
  },
})
@Injectable()
export class ShowsState {
  @Selector()
  static inProgress(state: ShowsStateModel): boolean {
    return state.inProgress;
  }

  @Selector()
  static count(state: ShowsStateModel): number {
    return state.count;
  }

  constructor(private showService: ShowService) {}

  @Action(ShowsActions.LoadCount)
  @ImmutableContext()
  loadCount(ctx: StateContext<ShowsStateModel>) {
    ctx.setState((state: ShowsStateModel) => {
      state.inProgress = true;
      return state;
    });

    return this.showService.getCount().pipe(
      tap((count: number) => {
        ctx.setState((state: ShowsStateModel) => {
          state.inProgress = false;
          state.count = count;
          return state;
        });
      }),
      catchError((error) => {
        console.error(error);

        return of(error);
      })
    );
  }
}
