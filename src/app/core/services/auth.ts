import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../shared/models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/Auth`;

  login(credenciales: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token_macros', res.token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token_macros');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token_macros');
  }

  // Decodifica el payload del JWT sin librería externa
  private getPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getRol(): string | null {
    const payload = this.getPayload();
    if (!payload) return null;
    // .NET usa este claim para el rol
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      ?? payload['role']
      ?? null;
  }

  esAdmin(): boolean {
    return this.getRol() === 'Nutricionista';
  }

  getNombre(): string {
    const payload = this.getPayload();
    return payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      ?? payload?.['name']
      ?? 'Usuario';
  }

  logout(): void {
    localStorage.removeItem('token_macros');
    this.router.navigate(['/home']);
  }

  // ==========================================
// NUEVOS MÉTODOS DE RECUPERACIÓN DE CUENTA (CORREGIDOS)
// ==========================================

// 1. Envía la solicitud mapeando exactamente el DTO de .NET (Email con 'E' mayúscula)
forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, {
    Email: email
  });
}

// 2. Envía el token y clave mapeando el DTO de .NET (Token y NuevaPassword con Mayúsculas)
resetPassword(token: string, nuevaPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, {
    Token: token,
    NuevaPassword: nuevaPassword
  });
}
}
