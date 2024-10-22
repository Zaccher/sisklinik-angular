import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';
import { ApiMsg } from '../../models/ApiMsg';

@Injectable({
  providedIn: 'root'
})
export class AuthappService {

  server : string = environment.serverUserappService;
  port : string = environment.portUserappService;

  constructor(private http : HttpClient, private sessionService: SessionService) { }

  autenticaService(username: string, password: string) {

    // Stringa di autenticazione che poi verrà ripresa dall'interceptor principale - (auth.interceptor.ts)
    let AuthString : string = "Basic " + window.btoa(username + ":" + password);

    let headers = new HttpHeaders(
      {Authorization: "Basic " + window.btoa(username + ":" + password)}
    )

    return this.http.get<ApiMsg>(`http://${this.server}:${this.port}/api/login`,{headers}).pipe(
      map(
        data => {

          // Salviamo info fondamentali in sessionStorage
          this.sessionService.saveData("AuthToken", AuthString);
          this.sessionService.saveData("utente", username);
          return data;
        }
      )
    )
  }

  /*
  autentica = (username: string, password: string) : boolean => {

    // Stringa di autenticazione che poi verrà ripresa dall'interceptor principale - (auth.interceptor.ts)
    let AuthString : string = "Basic " + window.btoa(username + ":" + password);

    var retVal = (username === 'admin' && password === 'admin') ? true : false;

    if(retVal) {
      this.sessionService.saveData("utente", username);
      this.sessionService.saveData("AuthToken", AuthString);
    }

    return retVal;
  }*/

  loggedUser  = () : string | null => (sessionStorage.getItem("utente")) ? sessionStorage.getItem("utente") : "";

  isLogged = () : boolean => (sessionStorage.getItem("utente")) ? true: false;

  clearUser = () : void => sessionStorage.removeItem("utente");

  clearAll = () : void => sessionStorage.clear();
}
