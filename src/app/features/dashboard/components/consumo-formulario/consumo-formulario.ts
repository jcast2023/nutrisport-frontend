import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <--- ESTO ES LO QUE FALTABA
import { ConsumoService } from '../../../../core/services/consumo';
import { AlimentoService } from '../../../../core/services/alimento';
import { ConsumoCrearDto } from '../../../../shared/models/consumo-crear.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consumo-formulario',
  standalone: true,
  imports: [FormsModule, CommonModule], // Ahora CommonModule está definido y reconocido
  templateUrl: './consumo-formulario.html',
  styleUrl: './consumo-formulario.css'
})
export class ConsumoFormulario implements OnInit {
  private consumoService = inject(ConsumoService);
  private alimentoService = inject(AlimentoService);

  @Output() consumoRegistrado = new EventEmitter<void>();

  listaAlimentos: any[] = [];

  nuevoConsumo: ConsumoCrearDto = {
    alimentoId: 0,
    gramosConsumidos: 0,
    comidaTipo: 'Desayuno'
  };

  ngOnInit(): void {
    this.cargarAlimentos();
  }

  cargarAlimentos(): void {
    this.alimentoService.obtenerTodos().subscribe({
      next: (data) => {
        this.listaAlimentos = data;
      },
      error: (err) => {
        console.error('DETALLE DEL ERROR:', err);
        Swal.fire('Error', 'No se pudieron cargar los alimentos: ' + err.message, 'error');
      }
    });
  }

  registrar(): void {
    this.consumoService.registrarConsumo(this.nuevoConsumo).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Consumo guardado', 'success');
        this.nuevoConsumo = { alimentoId: 0, gramosConsumidos: 0, comidaTipo: 'Desayuno' };
        this.consumoRegistrado.emit();
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire('Error', 'Hubo un problema al guardar', 'error');
      }
    });
  }

  registrarConsumo(): void {
    if (this.nuevoConsumo.alimentoId <= 0 || this.nuevoConsumo.gramosConsumidos <= 0) {
      Swal.fire('Error', 'Completa los campos correctamente', 'error');
      return;
    }
    this.registrar();
  }
}
