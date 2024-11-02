import { Routes } from '@angular/router';
import { Ruoli } from './models/Ruoli';
import { AuthGuard } from './core/services/route-guard.service';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path:'login',
        loadComponent: () => import('./pages/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path:'agendaamb',
        loadComponent: () => import('./modules/calendar/pages/agendaamb/agendaamb.component')
          .then(m => m.AgendaambComponent), canActivate:[AuthGuard], data: { roles: [Ruoli.utente, Ruoli.amministratore] }
      },
      {
        path:'ricercapaziente',
        loadComponent: () => import('./pages/ricercapaziente/ricercapaziente.component')
        .then(m=>m.RicercapazienteComponent), canActivate:[AuthGuard], data: { roles: [Ruoli.utente, Ruoli.amministratore] }
      },
      {
        path:'aggiungimodificapaziente',
        loadComponent: () => import('./pages/aggiungimodificapaziente/aggiungimodificapaziente.component')
        .then(m=>m.AggiungimodificapazienteComponent), canActivate:[AuthGuard], data: { roles: [Ruoli.utente, Ruoli.amministratore] }
      },
      {
        path:'aggiungimodificaevento',
        loadComponent: () => import('./modules/calendar/pages/aggiungimodificaevento/aggiungimodificaevento.component')
        .then(m=>m.AggiungimodificaeventoComponent), canActivate:[AuthGuard], data: { roles: [Ruoli.utente, Ruoli.amministratore] }
      },
      {
        path:'aggiungimodificautente',
        loadComponent: () => import('./pages/aggiugnimodificautente/aggiungimodificautente.component')
        .then(m=>m.AggiungimodificautenteComponent), canActivate:[AuthGuard], data: { roles: [Ruoli.amministratore] }
      },
      {
        path:'forbidden',
        loadComponent: () => import('./pages/forbidden/forbidden.component')
          .then(m => m.ForbiddenComponent)
      },
];
