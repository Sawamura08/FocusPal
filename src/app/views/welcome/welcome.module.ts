import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { OnBoardingComponent } from '../on-boarding/on-boarding.component';

@NgModule({
  declarations: [WelcomeComponent, OnBoardingComponent],
  imports: [CommonModule, WelcomeRoutingModule],
})
export class WelcomeModule {}
