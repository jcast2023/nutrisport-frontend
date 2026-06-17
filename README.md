# NutriSport Frontend 🥗

[![Angular](https://img.shields.io/badge/Angular-20-DD0031.svg)](https://angular.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Aplicación web para el sistema de nutrición deportiva **NutriSport**, desarrollada con Angular 20.

---

## 🚀 Tecnologías

| Tecnología | Uso |
|------------|-----|
| **Angular 20** | Framework principal (standalone components) |
| **ng2-charts + Chart.js** | Gráficos de macros y evolución corporal |
| **SweetAlert2** | Alertas y modales elegantes |
| **Tabler Icons** | Iconografía |
| **Tailwind CSS** | Utilidades de estilo (parcial) |

---

## 📁 Estructura del proyecto
src/app/
├── core/
│ ├── guards/
│ │ ├── auth-guard.ts # Protege rutas privadas
│ │ └── public-guard.ts # Redirige si ya está logueado
│ ├── interceptors/
│ │ └── auth-interceptor.ts # Inyecta JWT en cada request
│ └── services/
│ ├── auth.ts # Login, logout, roles
│ ├── alimento.ts # Catálogo de alimentos
│ ├── cita.service.ts # Gestión de citas
│ └── consumo.ts # Registro de consumos
├── features/
│ ├── home/ # Landing page pública
│ ├── login/ # Inicio de sesión
│ ├── registro/ # Registro de pacientes
│ ├── dashboard/ # Panel del paciente
│ │ ├── components/
│ │ │ └── consumo-formulario/
│ │ ├── cita/
│ │ │ └── cita-formulario/
│ │ ├── lista-citas/
│ │ └── mediciones/ # Ficha clínica
│ ├── admin/ # Panel del nutricionista
│ └── blog/
│ ├── articulo-1/ # Proteínas
│ ├── articulo-2/ # Timing nutricional
│ └── articulo-3/ # Déficit calórico
└── shared/
└── models/

text

---

## 🗺️ Rutas

| Ruta | Componente | Acceso |
|------|------------|--------|
| `/home` | Home | Público |
| `/login` | Login | Público |
| `/registro` | Registro | Público |
| `/dashboard` | Dashboard | Atleta |
| `/admin` | Admin | Nutricionista |
| `/blog/proteinas` | Articulo1 | Público |
| `/blog/timing-nutricional` | Articulo2 | Público |
| `/blog/deficit-calorico` | Articulo3 | Público |

---

## 👤 Roles y vistas

### 🧑 Paciente (Atleta)

| Sección | Descripción |
|---------|-------------|
| **Resumen** | Totales del día + gráfico de macros |
| **Mis macros** | Registro de consumos diarios |
| **Mis citas** | Agendar y ver citas |
| **Mi objetivo** | Barras de progreso vs meta asignada |
| **Mi ficha** | Mediciones corporales + gráficos de evolución |

### 👨‍💼 Nutricionista (Admin)

| Sección | Descripción |
|---------|-------------|
| **Citas** | Gestión y cambio de estado |
| **Pacientes** | Lista, ficha clínica, asignación de objetivos |
| **Alimentos** | CRUD del catálogo |

---

## ⚙️ Configuración local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/jcast2023/nutrisport-frontend.git
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura la URL del backend** si es diferente a `https://localhost:7234` (edita los servicios en `src/app/core/services/`).

4. **Ejecuta el servidor de desarrollo:**
   ```bash
   ng serve --open
   ```

5. **Accede en:** `http://localhost:4200`

6. **Build para producción:**
   ```bash
   npm run build
   ```

---

## 🔗 Repositorio relacionado

| Proyecto | Link |
|----------|------|
| **Backend** | [nutrisport-backend](https://github.com/jcast2023/nutrisport-backend) |

---

## 👨‍💻 Desarrollador

Desarrollado por **Julio Castillo** como proyecto de portafolio.

- 🌐 GitHub: [@jcast2023](https://github.com/jcast2023)

---

## 📄 License

MIT License - consulta el archivo [LICENSE](LICENSE) para más detalles.
