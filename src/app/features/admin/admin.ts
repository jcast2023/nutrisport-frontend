import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'admin.html',
  styleUrl: 'admin.css'
})
export class Admin implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  // ── Estado general ──
  seccionActiva = 'citas';

  // ── Citas ──
  citas: any[] = [];

  // ── Pacientes ──
  pacientes: any[] = [];

  // ── Objetivo nutricional ──
  mostrandoFormObjetivo = false;
  pacienteSeleccionado: any = null;
  objetivoForm = {
    usuarioId: 0,
    caloriasObjetivo: 0,
    proteinasObjetivo: 0,
    carbohidratosObjetivo: 0,
    grasasObjetivo: 0
  };

  // ── Alimentos ──
  alimentos: any[] = [];
  mostrandoFormAlimento = false;
  alimentoEditandoId: number | null = null;
  alimentoForm = {
    nombre: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  };

  // ── Ficha clínica ──
  mostrandoFicha = false;
  pacienteFicha: any = null;
  medicionesPaciente: any[] = [];

  // ── Formulario de medición ──
  mostrandoFormMedicion = false;
  pacienteMedicion: any = null;
  medicionForm = {
    peso: null as number | null,
    talla: null as number | null,
    cinturasCm: null as number | null,
    caderaCm: null as number | null,
    porcentajeGrasa: null as number | null,
    masaMuscular: null as number | null,
    notas: ''
  };

  // ── Getters ──
  get citasPendientes() { return this.citas.filter(c => c.estado === 'Pendiente'); }
  get citasConfirmadas() { return this.citas.filter(c => c.estado === 'Confirmada'); }

  // ── Lifecycle ──
  ngOnInit() { this.cargarCitas(); }

  // ── Navegación ──
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'pacientes' && this.pacientes.length === 0) this.cargarPacientes();
    if (seccion === 'alimentos') this.cargarAlimentos();
  }

  // ── Citas ──
  cargarCitas() {
    this.http.get<any[]>(`${this.apiUrl}/Citas/TodasLasCitas`).subscribe({
      next: (data) => this.citas = data,
      error: () => {}
    });
  }

  cambiarEstado(id: number, estado: string) {
    this.http.put(`${this.apiUrl}/Citas/${id}/estado`, { estado }).subscribe({
      next: () => this.cargarCitas(),
      error: () => {}
    });
  }

  // ── Pacientes ──
  cargarPacientes() {
    this.http.get<any[]>(`${this.apiUrl}/Auth/Pacientes`).subscribe({
      next: (data) => this.pacientes = data,
      error: () => {}
    });
  }

  // ── Objetivo ──
  abrirFormObjetivo(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.objetivoForm = {
      usuarioId: paciente.id,
      caloriasObjetivo: 0,
      proteinasObjetivo: 0,
      carbohidratosObjetivo: 0,
      grasasObjetivo: 0
    };
    this.mostrandoFormObjetivo = true;
  }

  asignarObjetivo() {
    this.http.post(`${this.apiUrl}/Objetivos`, this.objetivoForm).subscribe({
      next: () => {
        this.mostrandoFormObjetivo = false;
        const nombre = this.pacienteSeleccionado?.nombre ?? 'el paciente';
        this.pacienteSeleccionado = null;
        Swal.fire({
          title: '¡Objetivo asignado!',
          text: `El plan nutricional de ${nombre} fue actualizado correctamente.`,
          icon: 'success',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#14b8a6'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo asignar el objetivo.', 'error')
    });
  }

  // ── Alimentos ──
  cargarAlimentos() {
    this.http.get<any[]>(`${this.apiUrl}/Alimentos`).subscribe({
      next: (data) => this.alimentos = data,
      error: () => {}
    });
  }

  abrirFormAlimento(alimento?: any) {
    if (alimento) {
      this.alimentoEditandoId = alimento.id;
      this.alimentoForm = {
        nombre: alimento.nombre,
        calorias: alimento.calorias,
        proteinas: alimento.proteinas,
        carbohidratos: alimento.carbohidratos,
        grasas: alimento.grasas
      };
    } else {
      this.alimentoEditandoId = null;
      this.alimentoForm = { nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
    }
    this.mostrandoFormAlimento = true;
  }

  guardarAlimento() {
    const url = this.alimentoEditandoId
      ? `${this.apiUrl}/Alimentos/${this.alimentoEditandoId}`
      : `${this.apiUrl}/Alimentos`;
    const metodo = this.alimentoEditandoId
      ? this.http.put(url, this.alimentoForm)
      : this.http.post(url, this.alimentoForm);

    metodo.subscribe({
      next: () => {
        this.mostrandoFormAlimento = false;
        this.cargarAlimentos();
        Swal.fire({
          title: this.alimentoEditandoId ? '¡Actualizado!' : '¡Agregado!',
          text: `Alimento ${this.alimentoEditandoId ? 'actualizado' : 'agregado'} correctamente.`,
          icon: 'success',
          confirmButtonColor: '#14b8a6'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo guardar el alimento.', 'error')
    });
  }

  eliminarAlimento(id: number) {
    Swal.fire({
      title: '¿Eliminar alimento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    }).then(r => {
      if (r.isConfirmed) {
        this.http.delete(`${this.apiUrl}/Alimentos/${id}`).subscribe({
          next: () => this.cargarAlimentos(),
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  // ── Ficha clínica ──
  verFichaPaciente(paciente: any) {
    this.pacienteFicha = paciente;
    this.mostrandoFicha = true;
    this.http.get<any[]>(`${this.apiUrl}/Mediciones/Paciente/${paciente.id}`).subscribe({
      next: (data) => this.medicionesPaciente = data,
      error: () => this.medicionesPaciente = []
    });
  }

  // ── Registro de medición desde admin ──
  abrirFormMedicion(paciente: any) {
    this.pacienteMedicion = paciente;
    this.medicionForm = {
      peso: null, talla: null, cinturasCm: null,
      caderaCm: null, porcentajeGrasa: null,
      masaMuscular: null, notas: ''
    };
    this.mostrandoFormMedicion = true;
  }

  registrarMedicionPaciente() {
    if (!this.medicionForm.peso || !this.medicionForm.talla) {
      Swal.fire('Atención', 'Peso y talla son obligatorios.', 'warning');
      return;
    }
    this.http.post(
      `${this.apiUrl}/Mediciones/RegistrarParaPaciente/${this.pacienteMedicion.id}`,
      this.medicionForm
    ).subscribe({
      next: (res: any) => {
        this.mostrandoFormMedicion = false;
        Swal.fire({
          title: '¡Medición registrada!',
          html: `IMC: <strong>${res.imc}</strong> — <span style="color:#14b8a6">${res.categoriaIMC}</span>`,
          icon: 'success',
          confirmButtonColor: '#14b8a6'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo registrar la medición.', 'error')
    });
  }

  // ── Auth ──
  cerrarSesion() { this.authService.logout(); }
}
