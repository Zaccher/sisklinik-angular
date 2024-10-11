import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../core/services/session.service';
import { AuthappService } from '../core/services/authapp.service';

/* Questa classe permette di effettuare la BasicAuth in tutte le chiamate dell'applicativo
   a patto che l'utente sia loggato!
*/

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private BasicAuth: AuthappService, private sessionService: SessionService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    /*
    let utente : string = "admin";
    let password : string = "admin";
    */

    // Il valore viene caricato dal file authapp.service.ts
    let AuthString = this.sessionService.getData("AuthToken");

    // Se siamo loggati
    if(this.BasicAuth.loggedUser()) {
      // Allora inserisci l'authorization header nella i-esima request che partirà
      req = req.clone({
        setHeaders : {Authorization : AuthString}
      })
    }

    return next.handle(req);
  }

}
