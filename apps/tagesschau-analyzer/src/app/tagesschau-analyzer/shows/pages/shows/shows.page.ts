import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.page.html',
  styleUrls: ['./shows.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowsPage implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
