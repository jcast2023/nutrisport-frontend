import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService, CitaResponse } from '../../../core/services/cita.service';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './lista-citas.html',
  styleUrls: ['./lista-citas.css']
})
export class ListaCitasComponent implements OnInit {
  private citaService = inject(CitaService);
  citas: CitaResponse[] = [];

  ngOnInit() { this.cargarCitas(); }

  cargarCitas() {
    this.citaService.obtenerMisCitas().subscribe({
      next: (data: CitaResponse[]) => this.citas = data,
      error: (err: any) => console.error('Error al cargar citas:', err)
    });
  }

  recargar() { this.cargarCitas(); }
}
