import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  credenciales = { email: '', password: '' };
  errorMensaje: string = '';
  cargando: boolean = false;

  ejecutarLogin(): void {
    this.cargando = true;
    this.errorMensaje = '';

    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
  localStorage.setItem('token_macros', res.token);
  const esAdmin = this.authService.esAdmin();
  Swal.fire({
    title: '¡Bienvenido!',
    text: esAdmin ? 'Cargando panel de administración...' : 'Cargando tu dashboard nutricional...',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  }).then(() => {
    this.router.navigate([esAdmin ? '/admin' : '/dashboard']);
  });
},
      error: () => {
        this.errorMensaje = 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}
