import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroinventarioPage } from './registroinventario.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroinventarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroinventarioPageRoutingModule {}
