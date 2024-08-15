import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventariomenuPage } from './inventariomenu.page';

const routes: Routes = [
  {
    path: '',
    component: InventariomenuPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventariomenuPageRoutingModule {}
