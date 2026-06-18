import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CrearCitaDto {
  fechaHora: string;
  notas: string;
}

export interface CitaResponse {
  id: number;
  usuarioId: number;
  nombrePaciente: string;
  fechaHora: string;
  estado: string;
  notas: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Citas`;

  obtenerMisCitas(): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(`${this.apiUrl}/MisCitas`);
  }

  agendarCita(dto: CrearCitaDto): Observable<{ mensaje: string; cita: CitaResponse }> {
    return this.http.post<{ mensaje: string; cita: CitaResponse }>(this.apiUrl, dto);
  }
}
