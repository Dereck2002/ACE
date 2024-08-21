import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioregistroPage } from './inventarioregistro.page';

const routes: Routes = [
  {
    path: '',
    component: InventarioregistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioregistroPageRoutingModule {}
