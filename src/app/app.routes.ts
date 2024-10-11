import { Routes } from '@angular/router';
import { RicercapazienteComponent } from './pages/ricercapaziente/ricercapaziente.component';
import { AggiungimodificapazienteComponent } from './pages/aggiungimodificapaziente/aggiungimodificapaziente.component';
import { AggiungimodificaeventoComponent } from './modules/calendar/pages/aggiungimodificaevento/aggiungimodificaevento.component';

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
          .then(m => m.AgendaambComponent)
      },
      {
        path:'ricercapaziente',
        component: RicercapazienteComponent
      },
      {
        path:'aggiungimodificapaziente',
        component: AggiungimodificapazienteComponent
      },
      {
        path:'aggiungimodificaevento',
        component: AggiungimodificaeventoComponent
      } 
];
