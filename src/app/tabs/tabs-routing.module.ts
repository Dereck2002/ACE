import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ReloadGuard } from '../reload.guard'; // Importa tu guard

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/secure/home/home.module').then(
            (m) => m.HomePageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('../pages/secure/charts/charts.module').then(
            (m) => m.ChartsPageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        path: 'listacostos',
        loadChildren: () =>
          import('../pages/secure/listacostos/listacostos.module').then(
            (m) => m.ListacostosPageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('../pages/secure/payments/payments.module').then(
            (m) => m.PaymentsPageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        path: 'report',
        loadChildren: () =>
          import('../pages/secure/report/report.module').then(
            (m) => m.ReportPageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        path: 'styleguide',
        loadChildren: () =>
          import('../pages/secure/styleguide/styleguide.module').then(
            (m) => m.StyleguidePageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        path: 'editproducto',
        loadChildren: () =>
          import('../pages/secure/editproducto/editproducto.module').then(
            (m) => m.EditproductoPageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      {
        //inventariomenu
        path: 'inventariomenu',
        loadChildren: () =>
          import('../pages/secure/inventariomenu/inventariomenu.module').then(
            (m) => m.InventariomenuPageModule
          ),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
      //inventarioregistro
      {
        path: 'inventarioregistro',
        loadChildren: () =>
          import(
            '../pages/secure/inventarioregistro/inventarioregistro.module'
          ).then((m) => m.InventarioregistroPageModule),
        canActivate: [ReloadGuard], // Aplica el guard aquí
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
