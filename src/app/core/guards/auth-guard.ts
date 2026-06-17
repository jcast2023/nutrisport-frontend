import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const token = localStorage.getItem('token_macros');

    if (token) {
      return true; // Acceso permitido
    } else {
      this.router.navigate(['/login']); // Redirigir al login
      return false;
    }
  }
}
