import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxsModule } from '@ngxs/store';

import { TagesschauAnalyzerRoutingModule } from './tagesschau-analyzer-routing.module';

import { ShowsState } from '../core/states/shows/shows.state';
import { ShowListState } from '../core/states/show-list/show-list.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TagesschauAnalyzerRoutingModule,

    NgxsModule.forFeature([ShowsState, ShowListState]),
  ],
})
export class TagesschauAnalyzerModule {}
