import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './components/header/header.component';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { TagesschauLogoComponent } from './components/tagesschau-logo/tagesschau-logo.component';

@NgModule({
  declarations: [HeaderComponent, PageContainerComponent, TagesschauLogoComponent],
  imports: [
    CommonModule,

    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,

    HeaderComponent,

    PageContainerComponent,

    TagesschauLogoComponent,
  ],
})
export class SharedModule {}
