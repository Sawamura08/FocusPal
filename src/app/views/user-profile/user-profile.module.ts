import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SharedModule } from '../../module/shared.module';

@NgModule({
  declarations: [EditProfileComponent],
  imports: [CommonModule, UserProfileRoutingModule, FormsModule, SharedModule],
  exports: [EditProfileComponent],
})
export class UserProfileModule {}
