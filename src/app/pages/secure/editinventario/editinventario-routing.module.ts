import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditinventarioPage } from './editinventario.page';

const routes: Routes = [
  {
    path: '',
    component: EditinventarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditinventarioPageRoutingModule {}
