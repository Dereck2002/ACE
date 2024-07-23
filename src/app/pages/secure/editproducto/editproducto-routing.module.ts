import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditproductoPage } from './editproducto.page';

const routes: Routes = [
  {
    path: '',
    component: EditproductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditproductoPageRoutingModule {}
