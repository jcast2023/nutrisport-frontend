import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsumoCrearDto } from '../../shared/models/consumo-crear.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsumoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Consumos`;

  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }

  // Método para obtener los totales (lo usas en tu dashboard)
  getTotales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totales`);
  }

  registrarConsumo(data: ConsumoCrearDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }


  eliminarConsumo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
