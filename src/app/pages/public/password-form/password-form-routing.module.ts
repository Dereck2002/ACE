import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordFormPage } from './password-form.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordFormPageRoutingModule {}
