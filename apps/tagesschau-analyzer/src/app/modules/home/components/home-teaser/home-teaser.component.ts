import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tagesschau-analyzer-home-teaser',
  templateUrl: './home-teaser.component.html',
  styleUrls: ['./home-teaser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTeaserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
