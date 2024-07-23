import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListacostosPage } from './listacostos.page';

const routes: Routes = [
  {
    path: '',
    component: ListacostosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListacostosPageRoutingModule {}
