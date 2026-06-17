import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService, CrearCitaDto } from '../../../core/services/cita.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-formulario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cita-formulario.html',
  styleUrl: './cita-formulario.css'
})
export class CitaFormularioComponent {
  private citaService = inject(CitaService);

  @Output() citaAgendada = new EventEmitter<void>();

  cita: CrearCitaDto = { fechaHora: '', notas: '' };
  cargando = false;

  guardarCita(): void {
    if (!this.cita.fechaHora) {
      Swal.fire('Atención', 'Selecciona una fecha y hora.', 'warning');
      return;
    }
    this.cargando = true;
    this.citaService.agendarCita(this.cita).subscribe({
      next: (res) => {
        Swal.fire('¡Cita agendada!', res.mensaje, 'success');
        this.cita = { fechaHora: '', notas: '' };
        this.cargando = false;
        this.citaAgendada.emit();
      },
      error: (err) => {
        Swal.fire('Error',
          err.status === 401 ? 'Tu sesión expiró.' : 'No se pudo agendar la cita.',
          'error');
        this.cargando = false;
      }
    });
  }
}
