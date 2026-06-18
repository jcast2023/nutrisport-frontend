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
  mostrarPassword: boolean = false;

  errores = {
    email: '',
    password: ''
  };

  validar(): boolean {
    this.errores = { email: '', password: '' };
    let valido = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.credenciales.email.trim()) {
      this.errores.email = 'El correo es obligatorio.';
      valido = false;
    } else if (!emailRegex.test(this.credenciales.email)) {
      this.errores.email = 'Ingresa un correo válido.';
      valido = false;
    }

    if (!this.credenciales.password) {
      this.errores.password = 'La contraseña es obligatoria.';
      valido = false;
    } else if (this.credenciales.password.length < 6) {
      this.errores.password = 'La contraseña debe tener al menos 6 caracteres.';
      valido = false;
    }

    return valido;
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  ejecutarLogin(): void {
    if (!this.validar()) return;

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
