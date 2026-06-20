import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { AuthGuard } from './core/guards/auth-guard';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { Admin } from './features/admin/admin';
import { Registro } from './features/registro/registro';
import { publicGuard } from './core/guards/public-guard';
import { Articulo1 } from './features/blog/articulo-1/articulo-1';
import { Articulo2 } from './features/blog/articulo-2/articulo-2';
import { Articulo3 } from './features/blog/articulo-3/articulo-3';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [publicGuard] },
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'registro', component: Registro, canActivate: [publicGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'admin', component: Admin, canActivate: [AuthGuard] },
  { path: 'blog/proteinas', component: Articulo1 },
   { path: 'blog/timing-nutricional', component: Articulo2 },
{ path: 'blog/deficit-calorico', component: Articulo3 },
{ path: 'reset-password', component: ResetPasswordComponent },
{ path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [publicGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }

];
