import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';
// import { PublicGuard } from './guards/public.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome', // TODO: Set this to ''
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./pages/secure/secure.module').then(m => m.SecureModule),
    // canActivate: [AuthGuard] // Secure all child pages
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/public/welcome/welcome.module').then(m => m.WelcomePageModule),
    // canActivate: [PublicGuard] // Prevent for signed in users
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/public/login/login.module').then(m => m.LoginPageModule),
    // canActivate: [PublicGuard] // Prevent for signed in users
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/public/registro/registro.module').then(m => m.RegistroPageModule),
    // canActivate: [PublicGuard] // Prevent for signed in users
  },
  {
    path: 'recuperer_c',
    loadChildren: () => import('./pages/public/recuperer_c/recuperer_c.module').then( m => m.PasswordResetPageModule),
    // canActivate: [PublicGuard] // Prevent for signed in users
  },
{
  path: 'password-form',
  loadChildren: () => import('./pages/public/password-form/password-form.module').then( m => m.PasswordFormPageModule)
},

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
