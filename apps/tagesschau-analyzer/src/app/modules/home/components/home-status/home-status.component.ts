import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { ShowService } from '../../../../core/services/show.service';

@Component({
  selector: 'tagesschau-analyzer-home-status',
  templateUrl: './home-status.component.html',
  styleUrls: ['./home-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeStatusComponent implements OnInit {
  count$: Observable<number>;

  constructor(private showService: ShowService) {}

  ngOnInit(): void {
    this.count$ = this.showService.getCount();
  }
}
