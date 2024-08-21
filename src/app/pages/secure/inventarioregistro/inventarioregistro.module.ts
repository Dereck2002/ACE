import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioregistroPageRoutingModule } from './inventarioregistro-routing.module';

import { InventarioregistroPage } from './inventarioregistro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioregistroPageRoutingModule
  ],
  declarations: [InventarioregistroPage]
})
export class InventarioregistroPageModule {}
