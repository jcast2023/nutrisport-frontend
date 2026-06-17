import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import Swal from 'sweetalert2';

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

  datos = { nombre: '', apellido: '', email: '', password: '' };
  errorMensaje = '';
  cargando = false;

  registrar(): void {
    if (!this.datos.nombre || !this.datos.email || !this.datos.password) {
      this.errorMensaje = 'Completa todos los campos obligatorios.';
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    this.http.post('https://localhost:7234/api/Auth/register', {
      nombre: this.datos.nombre,
      apellido: this.datos.apellido,
      email: this.datos.email,
      password: this.datos.password
    }).subscribe({
      next: () => {
        // Registro exitoso — login automático
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
