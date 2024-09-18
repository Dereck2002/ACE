import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./../../tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'styleguide',
    loadChildren: () => import('./styleguide/styleguide.module').then(m => m.StyleguidePageModule)
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./ajustes/ajustes.module').then(m => m.AjustesPageModule)
  },
  {
    path: 'ajustes/profile/edit',
    loadChildren: () => import('./profile/edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: 'payments/detail',
    loadChildren: () => import('./payments/payment-detail/payment-detail.module').then( m => m.PaymentDetailPageModule)
  },
  {
    path: 'listacostos',
    loadChildren: () => import('./listacostos/listacostos.module').then( m => m.ListacostosPageModule)
  },
  {
    path: 'editproducto',
    loadChildren: () => import('./editproducto/editproducto.module').then( m => m.EditproductoPageModule)
  },
  {
    path: 'registroinventario',
    loadChildren: () => import('./registroinventario/registroinventario.module').then( m => m.RegistroinventarioPageModule)
  },
  {
    path: 'editinventario',
    loadChildren: () => import('./editinventario/editinventario.module').then( m => m.EditinventarioPageModule)
  },
  {
    path: 'inventariomenu',
    loadChildren: () => import('./inventariomenu/inventariomenu.module').then( m => m.InventariomenuPageModule)
  },
  {
    path: 'inventarioregistro',
    loadChildren: () => import('./inventarioregistro/inventarioregistro.module').then( m => m.InventarioregistroPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SecureRoutingModule { }
