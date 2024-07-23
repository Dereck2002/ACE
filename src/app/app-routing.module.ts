import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/secure/secure.module').then((m) => m.SecureModule),
    canActivate: [AuthGuard], // Protege esta ruta con el guardia de ruta
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/public/welcome/welcome.module').then(
        (m) => m.WelcomePageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/public/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./pages/public/registro/registro.module').then(
        (m) => m.RegistroPageModule
      ),
  },
  {
    path: 'recuperer_c',
    loadChildren: () =>
      import('./pages/public/recuperer_c/recuperer_c.module').then(
        (m) => m.PasswordResetPageModule
      ),
  },
  {
    path: 'password-form',
    loadChildren: () =>
      import('./pages/public/password-form/password-form.module').then(
        (m) => m.PasswordFormPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
