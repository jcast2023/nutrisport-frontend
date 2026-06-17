// src/app/core/guards/public.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token_macros');

  // Si YA hay token, el usuario no debe ver el login, lo enviamos al dashboard
  if (token) {
    router.navigate(['/dashboard']);
    return false; // Bloqueamos el acceso a la ruta de login
  }

  // Si no hay token, permitimos el acceso al login/home
  return true;
};
