import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditproductoPageRoutingModule } from './editproducto-routing.module';

import { EditproductoPage } from './editproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditproductoPageRoutingModule
  ],
  declarations: [EditproductoPage]
})
export class EditproductoPageModule {}
