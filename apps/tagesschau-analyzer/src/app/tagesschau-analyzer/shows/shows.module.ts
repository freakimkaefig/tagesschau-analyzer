import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowsRoutingModule } from './shows-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ShowsPage } from './pages/shows/shows.page';
import { ShowListComponent } from './components/show-list/show-list.component';

@NgModule({
  declarations: [ShowsPage, ShowListComponent],
  imports: [CommonModule, ShowsRoutingModule, SharedModule],
})
export class ShowsModule {}
