import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroinventarioPageRoutingModule } from './registroinventario-routing.module';

import { RegistroinventarioPage } from './registroinventario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroinventarioPageRoutingModule
  ],
  declarations: [RegistroinventarioPage]
})
export class RegistroinventarioPageModule {}
