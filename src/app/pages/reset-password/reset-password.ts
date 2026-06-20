import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  token: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';
  mensajeExito: string = '';
  mensajeError: string = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.token) {
      this.mensajeError = 'El token de recuperación no es válido o no se ha proporcionado.';
    }
  }

  onSubmit(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.resetPassword(this.token, this.nuevaPassword).subscribe({
      next: (res: any) => {
        this.mensajeExito = res.mensaje;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: any) => {
        this.mensajeError = err.error?.mensaje || 'Ocurrió un error al restablecer la contraseña.';
      }
    });
  }
}
