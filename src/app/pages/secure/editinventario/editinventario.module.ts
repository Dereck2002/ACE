import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditinventarioPageRoutingModule } from './editinventario-routing.module';

import { EditinventarioPage } from './editinventario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditinventarioPageRoutingModule,
  ],
  declarations: [EditinventarioPage],
})
export class EditinventarioPageModule {}
