import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../core/services/session.service';
import { AuthJwtService } from '../core/services/authJwt.service';
import { AppCookieService } from '../core/services/app-cookie.service';
import { IToken } from '../models/Token';

/* Questa classe permette di effettuare la BasicAuth in tutte le chiamate dell'applicativo
   a patto che l'utente sia loggato!
*/

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private JwtAuth: AuthJwtService, private cookieService: AppCookieService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 

    let AuthHeader : string = "";

    var newToken: string = "";

    var url = req.url;

    let AuthString = this.cookieService.get("AuthToken");

    if(url == 'http://localhost:9100/refresh') {

      req = req.clone({
        setHeaders : {Authorization : AuthString}
      })

      return next.handle(req);
    }

    if (AuthString) {

      this.JwtAuth.refreshToken(AuthString);
      newToken = this.cookieService.get("AuthToken");

    }

    AuthHeader = (newToken != "") ? newToken : "";

    // Se siamo loggati
    if(this.JwtAuth.loggedUser()) {
      // Allora inserisci l'authorization header nella i-esima request che partirà
      req = req.clone({
        setHeaders : {Authorization : AuthHeader}
      })
    }

    return next.handle(req);
  }

}
