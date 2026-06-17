// navbar.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav>
      <a routerLink="/dashboard">Dashboard</a>

      <a *ngIf="!authService.estaLogueado()" routerLink="/login">Login</a>

      <button *ngIf="authService.estaLogueado()" (click)="authService.logout()">
        Cerrar Sesión
      </button>
    </nav>
  `
})
export class Navbar {
  authService = inject(AuthService); // Inyectamos el servicio
}
