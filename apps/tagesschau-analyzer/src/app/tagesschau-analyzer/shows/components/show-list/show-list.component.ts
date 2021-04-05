import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  ShowListItem,
  ShowListSortBy,
  SortDirection,
} from '@tagesschau-analyzer/core/types';

import { ShowListActions } from '../../../../core/states/show-list/show-list.actions';
import { ShowListState } from '../../../../core/states/show-list/show-list.state';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowListComponent implements OnInit {
  @Select(ShowListState.inProgress)
  inProgress$: Observable<boolean>;

  @Select(ShowListState.limit)
  limit$: Observable<number>;

  @Select(ShowListState.sortBy)
  sortBy$: Observable<ShowListSortBy>;

  @Select(ShowListState.count)
  count$: Observable<number>;

  @Select(ShowListState.shows)
  shows$: Observable<ShowListItem[]>;

  displayedColumns: string[] = ['date', 'time'];

  ngOnInit(): void {
    this.load();
  }

  @Dispatch()
  load = () => new ShowListActions.Load();

  @Dispatch()
  setPage = (pageIndex: number, pageSize: number) =>
    new ShowListActions.SetPage({ pageIndex, pageSize });

  @Dispatch()
  setSort = (key: string, direction: SortDirection) =>
    new ShowListActions.SetSort({ key, direction });

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.setPage(pageIndex, pageSize);
  }

  onSortChange({ active, direction }: Sort): void {
    this.setSort(active, direction);
  }
}
