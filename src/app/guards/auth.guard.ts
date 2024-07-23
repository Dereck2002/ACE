import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      // Check if user is signed in
      const is_signed_in = await this.authService.getSession('persona');

      if (is_signed_in) {
        return true; // Permitir la navegación si el usuario está autenticado
      } else {
        this.router.navigate(['/welcome']); // Redirigir al usuario a la página de bienvenida si no está autenticado
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false; // Manejar errores de manera adecuada, por ejemplo, redirigiendo a una página de error
    }
  }
}
