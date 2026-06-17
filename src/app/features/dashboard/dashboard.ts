import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConsumoService } from '../../core/services/consumo';
import { AuthService } from '../../core/services/auth';
import { ConsumoFormulario } from './components/consumo-formulario/consumo-formulario';
import { CitaFormularioComponent } from './cita/cita-formulario';
import { ListaCitasComponent } from './lista-citas/lista-citas';
import { BaseChartDirective } from 'ng2-charts';
import Swal from 'sweetalert2';
import { MedicionesComponent } from './mediciones/medicion';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ConsumoFormulario, BaseChartDirective,
            CitaFormularioComponent, ListaCitasComponent, MedicionesComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private consumoService = inject(ConsumoService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  @ViewChild('listaCitas') listaCitas!: ListaCitasComponent;

  alimentos: any[] = [];
  objetivo: any = null;
  seccion = 'resumen';
  hoy = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  chartData: any = {
    labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
    datasets: [{ data: [0, 0, 0],
      backgroundColor: ['#14b8a6', '#3b82f6', '#f59e0b'],
      borderWidth: 0 }]
  };

  chartOptions: any = {
    cutout: '72%',
    plugins: { legend: { display: false } }
  };

  get tituloSeccion(): string {
  const titulos: any = {
    resumen: 'Mi resumen',
    macros: 'Mis macros',
    citas: 'Mis citas',
    objetivo: 'Mi objetivo',
    mediciones: 'Mi ficha clínica'
  };
  return titulos[this.seccion];
}

get subtituloSeccion(): string {
  const subs: any = {
    resumen: 'Tu progreso nutricional de hoy',
    macros: 'Registra y revisa tus consumos del día',
    citas: 'Agenda y gestiona tus consultas',
    objetivo: 'Seguimiento de tus metas nutricionales',
    mediciones: 'Registro y evolución de tus mediciones corporales'
  };
  return subs[this.seccion];
}

  ngOnInit() {
    this.cargarDatos();
    this.cargarObjetivo();
  }

  cargarDatos() {
    this.consumoService.getHistorial().subscribe({
      next: (data: any[]) => {
        this.alimentos = data;
        this.actualizarGrafico();
      },
      error: () => {}
    });
  }

  cargarObjetivo() {
    const token = localStorage.getItem('token_macros');
    if (!token) return;
    this.http.get(
      'https://localhost:7234/api/Objetivos/MiObjetivo',
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (data) => this.objetivo = data,
      error: () => this.objetivo = null
    });
  }

  actualizarGrafico() {
    const p = this.totales.proteinas;
    const c = this.totales.carbohidratos;
    const g = this.totales.grasas;
    this.chartData = {
      ...this.chartData,
      datasets: [{ ...this.chartData.datasets[0], data: [p, c, g] }]
    };
  }

  get totales() {
    return this.alimentos.reduce((acc, curr) => ({
      calorias: acc.calorias + (curr.caloriasTotales || 0),
      proteinas: acc.proteinas + (curr.proteinasTotales || 0),
      carbohidratos: acc.carbohidratos + (curr.carbohidratosTotales || 0),
      grasas: acc.grasas + (curr.grasasTotales || 0)
    }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  }

  get porcentajeCalorias(): number {
    if (!this.objetivo?.caloriasObjetivo) return 0;
    return Math.min((this.totales.calorias / this.objetivo.caloriasObjetivo) * 100, 100);
  }

  get porcentajeProteinas(): number {
    if (!this.objetivo?.proteinasObjetivo) return 0;
    return Math.min((this.totales.proteinas / this.objetivo.proteinasObjetivo) * 100, 100);
  }

  get porcentajeCarbohidratos(): number {
    if (!this.objetivo?.carbohidratosObjetivo) return 0;
    return Math.min((this.totales.carbohidratos / this.objetivo.carbohidratosObjetivo) * 100, 100);
  }

  get porcentajeGrasas(): number {
    if (!this.objetivo?.grasasObjetivo) return 0;
    return Math.min((this.totales.grasas / this.objetivo.grasasObjetivo) * 100, 100);
  }

  refrescarCitas() {
    this.listaCitas?.recargar();
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar este consumo?', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar', confirmButtonColor: '#ef4444'
    }).then(r => {
      if (r.isConfirmed) this.consumoService.eliminarConsumo(id)
        .subscribe(() => this.cargarDatos());
    });
  }

  cerrarSesion() { this.authService.logout(); }
}
