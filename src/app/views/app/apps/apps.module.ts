import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps.component';
import { TextPipePipe } from '../../../pipe/text-pipe.pipe';

@NgModule({
  declarations: [AppsComponent, TextPipePipe],
  imports: [CommonModule, AppsRoutingModule],
})
export class AppsModule {}
