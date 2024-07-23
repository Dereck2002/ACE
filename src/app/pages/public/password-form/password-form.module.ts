import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordFormPageRoutingModule } from './password-form-routing.module';

import { PasswordFormPage } from './password-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordFormPageRoutingModule
  ],
  declarations: [PasswordFormPage]
})
export class PasswordFormPageModule {}
