import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { ShowsState } from '../../../../core/states/shows/shows.state';
import { ShowsActions } from '../../../../core/states/shows/shows.actions';

@Component({
  selector: 'app-home-status',
  templateUrl: './home-status.component.html',
  styleUrls: ['./home-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeStatusComponent implements OnInit {
  @Select(ShowsState.inProgress)
  inProgress$: Observable<boolean>;

  @Select(ShowsState.count)
  count$: Observable<number>;

  ngOnInit(): void {
    // this.count$ = this.showService.getCount();
    this.loadCount();
  }

  @Dispatch()
  loadCount = () => new ShowsActions.LoadCount();
}
