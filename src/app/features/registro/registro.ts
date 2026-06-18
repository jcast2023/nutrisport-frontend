import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: 'registro.html',
  styleUrl: 'registro.css'
})
export class Registro {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  datos = { nombre: '', apellido: '', email: '', password: '', confirmarPassword: '' };
  errorMensaje = '';
  cargando = false;
  mostrarPassword = false;
  mostrarConfirmarPassword = false;

  errores = {
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  };

  validar(): boolean {
    this.errores = { nombre: '', email: '', password: '', confirmarPassword: '' };
    let valido = true;

    if (!this.datos.nombre.trim()) {
      this.errores.nombre = 'El nombre es obligatorio.';
      valido = false;
    } else if (this.datos.nombre.trim().length < 2) {
      this.errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
      valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.datos.email.trim()) {
      this.errores.email = 'El correo es obligatorio.';
      valido = false;
    } else if (!emailRegex.test(this.datos.email)) {
      this.errores.email = 'Ingresa un correo válido.';
      valido = false;
    }

    if (!this.datos.password) {
      this.errores.password = 'La contraseña es obligatoria.';
      valido = false;
    } else if (this.datos.password.length < 6) {
      this.errores.password = 'La contraseña debe tener al menos 6 caracteres.';
      valido = false;
    }

    if (!this.datos.confirmarPassword) {
      this.errores.confirmarPassword = 'Confirma tu contraseña.';
      valido = false;
    } else if (this.datos.password !== this.datos.confirmarPassword) {
      this.errores.confirmarPassword = 'Las contraseñas no coinciden.';
      valido = false;
    }

    return valido;
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmarPassword(): void {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  registrar(): void {
    if (!this.validar()) return;

    this.cargando = true;
    this.errorMensaje = '';

    this.http.post(`${environment.apiUrl}/Auth/register`, {
      nombre: this.datos.nombre,
      apellido: this.datos.apellido,
      email: this.datos.email,
      password: this.datos.password
    }).subscribe({
      next: () => {
        this.authService.login({
          email: this.datos.email,
          password: this.datos.password
        }).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Bienvenido!',
              text: 'Tu cuenta fue creada. Ya puedes agendar tu primera cita.',
              icon: 'success',
              timer: 2500,
              showConfirmButton: false
            }).then(() => this.router.navigate(['/dashboard']));
          },
          error: () => this.router.navigate(['/login'])
        });
      },
      error: (err) => {
        this.errorMensaje = err.error ?? 'No se pudo crear la cuenta. Intenta de nuevo.';
        this.cargando = false;
      }
    });
  }
}
