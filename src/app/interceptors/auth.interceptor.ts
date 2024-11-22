import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthJwtService } from '../core/services/authJwt.service';
import { AppCookieService } from '../core/services/app-cookie.service';
import { JwtHelperService } from '@auth0/angular-jwt';

/* Questa classe permette di effettuare la BasicAuth in tutte le chiamate dell'applicativo
   a patto che l'utente sia loggato!
*/

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private JwtAuth: AuthJwtService, private cookieService: AppCookieService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 

    let AuthHeader : string = "";
    var newToken: string = "";

    let exp : any; // parametro exp dentro il token
    var expNumber : number; // parametro exp convertito in number

    var url = req.url;

    let AuthString = this.cookieService.get("AuthToken");

    if(url == 'http://localhost:9100/refresh') {

      req = req.clone({
        setHeaders : {Authorization : AuthString}
      })

      return next.handle(req);
    }

    // Se è presente il token nei cookies
    if (AuthString) {

      // Creaiamo l'istanza dell tool che ci aiuterà a decodificare il token JWT
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(AuthString); // decodifichiamo il token

      // Ci prendiamo il parametro exp dal token
      exp = decodedToken['exp'];
      expNumber = exp as number;

      var countDownDate = new Date(expNumber*1000).getTime();

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      /* Prima di fare un refresh del token, verifichiamo 
         che manchino meno di 5 minuti allo scadere della sessione 
        */
      if(minutes < 5 && seconds <= 59) {
      
        this.JwtAuth.refreshToken(AuthString);

      }
      
      // Ci prendiamo il token dal cookies che potrebbe essere cambiato
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
