import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';
import { IToken } from '../../models/Token';

@Injectable({
  providedIn: 'root'
})
export class AuthJwtService {

  server : string = environment.serverUserappService;
  port : string = environment.portUserappService;

  constructor(private http : HttpClient, private sessionService: SessionService) { }

  autenticaService(username: string, password: string) {

    return this.http.post<IToken>(`${environment.authServerUri}`,{username,password}).pipe(
      map(
        data => {

          // Salviamo info fondamentali in sessionStorage
          this.sessionService.saveData("AuthToken", `Bearer ${data.token}`);
          this.sessionService.saveData("utente", username);
          return data;
        }
      )
    )
  }

  getAuthToken = () : string => {

    let AuthHeader : string | null = "";

    AuthHeader =  this.sessionService.getData("AuthToken");

    return (AuthHeader) ? AuthHeader : "";
  }

  loggedUser  = () : string | null => (sessionStorage.getItem("utente")) ? sessionStorage.getItem("utente") : "";

  isLogged = () : boolean => (sessionStorage.getItem("utente")) ? true: false;

  clearUser = () : void => sessionStorage.removeItem("utente");

  clearAll = () : void => sessionStorage.clear();
}
