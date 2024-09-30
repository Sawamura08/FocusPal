import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../components/loading/loading.component';
import { ModalComponent } from '../components/modal/modal.component';
import { TermsConditionsComponent } from '../components/terms-conditions/terms-conditions.component';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ModalComponent,
    TermsConditionsComponent,
    HeaderComponent,
  ],
  imports: [CommonModule],
  exports: [
    LoadingComponent,
    ModalComponent,
    TermsConditionsComponent,
    HeaderComponent,
  ],
})
export class SharedModule {}
