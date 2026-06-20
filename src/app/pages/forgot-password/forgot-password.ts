import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email: string = '';
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  // Aquí es donde va el método onSubmit() mejorado con la doble validación
  onSubmit(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cargando = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        // Captura 'mensaje' (minúscula) o 'Mensaje' (mayúscula) según responda .NET
        this.mensajeExito = res?.mensaje || res?.Mensaje || 'Si el correo coincide con una cuenta, recibirás un enlace de recuperación en unos instantes.';
        this.cargando = false;
      },
      error: (err: any) => {
        // Captura el error estructurado del backend o usa el genérico por si se cae el servidor
        this.mensajeError = err.error?.mensaje || err.error?.Mensaje || 'Ocurrió un error al procesar la solicitud.';
        this.cargando = false;
      }
    });
  }
}
