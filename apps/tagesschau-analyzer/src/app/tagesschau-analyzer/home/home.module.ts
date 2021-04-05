import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { HomePage } from './pages/home/home.page';
import { HomeTeaserComponent } from './components/home-teaser/home-teaser.component';
import { HomeStatusComponent } from './components/home-status/home-status.component';

@NgModule({
  declarations: [HomePage, HomeTeaserComponent, HomeStatusComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
