import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../../module/shared.module';
import { HamburgerNavComponent } from './components/hamburger-nav/hamburger-nav.component';

@NgModule({
  declarations: [HomeComponent, HamburgerNavComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
