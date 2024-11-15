import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { AuthJwtService } from '../core/services/authJwt.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GestErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private auth: AuthJwtService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(

      catchError(err => {

        console.log(err);

        var error : string = (err.status > 0) ?
          err.error.message || err.statusText : 'Errore Generico. Impossibile Proseguire!';

        if ([401].indexOf(err.status) !== -1 && this.auth.isLogged()) {
          this.auth.clearAll();
          this.router.navigate(['login'],{queryParams: {expired:true}});
        }

        return throwError(() => error);
        
      })
    );
  }
}
