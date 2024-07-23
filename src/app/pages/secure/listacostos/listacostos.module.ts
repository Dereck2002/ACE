import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListacostosPageRoutingModule } from './listacostos-routing.module';

import { ListacostosPage } from './listacostos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListacostosPageRoutingModule
  ],
  declarations: [ListacostosPage]
})
export class ListacostosPageModule {}
