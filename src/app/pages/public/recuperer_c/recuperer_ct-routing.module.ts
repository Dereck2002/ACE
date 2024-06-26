import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetPage } from './recuperer_c.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordResetPageRoutingModule {}
