import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-mediciones',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, BaseChartDirective],
  templateUrl: 'medicion.html',
  styleUrl: 'medicion.css'
})
export class MedicionesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Mediciones`;

  historial: any[] = [];
  mostrandoFormulario = false;
  cargando = false;

  form = {
    peso: null as number | null,
    talla: null as number | null,
    cinturasCm: null as number | null,
    caderaCm: null as number | null,
    porcentajeGrasa: null as number | null,
    masaMuscular: null as number | null,
    notas: ''
  };

  // Gráfico peso
  pesoChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Peso (kg)',
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20,184,166,0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#14b8a6',
      pointRadius: 5
    }]
  };

  // Gráfico IMC
  imcChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'IMC',
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#f59e0b',
      pointRadius: 5
    }]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 11 } }
      }
    }
  };

  ngOnInit() { this.cargarHistorial(); }

  cargarHistorial() {
    this.http.get<any[]>(`${this.apiUrl}/MiHistorial`).subscribe({
      next: (data) => {
        this.historial = data;
        this.actualizarGraficos();
      },
      error: () => {}
    });
  }

  actualizarGraficos() {
    const ordenado = [...this.historial].reverse();
    const labels = ordenado.map(m =>
      new Date(m.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    );

    this.pesoChartData = {
      ...this.pesoChartData,
      labels,
      datasets: [{ ...this.pesoChartData.datasets[0], data: ordenado.map(m => m.peso) }]
    };

    this.imcChartData = {
      ...this.imcChartData,
      labels,
      datasets: [{ ...this.imcChartData.datasets[0], data: ordenado.map(m => m.imc) }]
    };
  }

  get ultimaMedicion() {
    return this.historial.length > 0 ? this.historial[0] : null;
  }

  get categoriaIMC(): string {
    const imc = this.ultimaMedicion?.imc;
    if (!imc) return '—';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  get colorIMC(): string {
    const imc = this.ultimaMedicion?.imc;
    if (!imc) return '#94a3b8';
    if (imc < 18.5) return '#3b82f6';
    if (imc < 25) return '#14b8a6';
    if (imc < 30) return '#f59e0b';
    return '#ef4444';
  }

  get variacionPeso(): string {
    if (this.historial.length < 2) return '';
    const actual = this.historial[0].peso;
    const anterior = this.historial[1].peso;
    const diff = actual - anterior;
    return diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
  }

  get colorVariacion(): string {
    if (this.historial.length < 2) return '#94a3b8';
    const diff = this.historial[0].peso - this.historial[1].peso;
    return diff <= 0 ? '#14b8a6' : '#ef4444';
  }

  registrar() {
    if (!this.form.peso || !this.form.talla) {
      Swal.fire('Atención', 'Peso y talla son obligatorios.', 'warning');
      return;
    }
    this.cargando = true;
    this.http.post(this.apiUrl, this.form).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: '¡Medición registrada!',
          html: `Tu IMC actual es <strong>${res.imc}</strong> — <span style="color:#14b8a6">${res.categoriaIMC}</span>`,
          icon: 'success',
          confirmButtonColor: '#14b8a6'
        });
        this.mostrandoFormulario = false;
        this.cargando = false;
        this.form = { peso: null, talla: null, cinturasCm: null, caderaCm: null, porcentajeGrasa: null, masaMuscular: null, notas: '' };
        this.cargarHistorial();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar la medición.', 'error');
        this.cargando = false;
      }
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar medición?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    }).then(r => {
      if (r.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => this.cargarHistorial(),
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }
}
