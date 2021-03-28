import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tagesschau-logo',
  templateUrl: './tagesschau-logo.component.html',
  styleUrls: ['./tagesschau-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagesschauLogoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
