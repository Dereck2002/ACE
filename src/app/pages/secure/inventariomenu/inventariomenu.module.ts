import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventariomenuPageRoutingModule } from './inventariomenu-routing.module';

import { InventariomenuPage } from './inventariomenu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventariomenuPageRoutingModule,
  ],
  declarations: [InventariomenuPage],
})
export class InventariomenuPageModule {}
