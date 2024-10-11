import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthappService {

  constructor(private sessionService: SessionService) { }

  autentica = (username: string, password: string) : boolean => {

    // Stringa di autenticazione che poi verrà ripresa dall'interceptor principale - (auth.interceptor.ts)
    let AuthString : string = "Basic " + window.btoa(username + ":" + password);

    var retVal = (username === 'admin' && password === 'admin') ? true : false;

    if(retVal) {
      this.sessionService.saveData("utente", username);
      this.sessionService.saveData("AuthToken", AuthString);
    }

    return retVal;
  }

  loggedUser  = () : string | null => (sessionStorage.getItem("utente")) ? sessionStorage.getItem("utente") : "";

  isLogged = () : boolean => (sessionStorage.getItem("utente")) ? true: false;

  clearUser = () : void => sessionStorage.removeItem("utente");

  clearAll = () : void => sessionStorage.clear();
}
