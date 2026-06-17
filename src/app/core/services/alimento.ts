import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alimento {
  id: number;
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

@Injectable({ providedIn: 'root' })
export class AlimentoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7234/api/Alimentos';

  obtenerTodos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(this.apiUrl);
  }
}
