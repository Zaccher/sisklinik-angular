import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { IToken } from '../../models/Token';
import { AppCookieService } from './app-cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthJwtService {

  server : string = environment.serverUserappService;
  port : string = environment.portUserappService;

  data: any;
  dataToken!: IToken;


  constructor(private http : HttpClient, 
              private sessionService: SessionService, 
              private cookieService: AppCookieService) { }

  autenticaService(username: string, password: string) {

    return this.http.post<IToken>(`${environment.authServerUri}`,{username,password}).pipe(
      map(
        data => {
          // Salviamo info fondamentali in sessionStorage
          //this.sessionService.saveData("AuthToken", `Bearer ${data.token}`);
          this.sessionService.saveData("utente", username);
          this.cookieService.set("AuthToken", `Bearer ${data.token}`);
          return data;
        }
      )
    )
  }

  async refreshToken(token: string): Promise<IToken> {

    console.log("Esecuzione Refresh Token");

    this.data = await this.http.get<IToken>(`${environment.refreshToken}`).toPromise();

    this.dataToken = this.data as IToken;
    
    this.cookieService.set("AuthToken", `Bearer ${this.dataToken.token}`);

    return this.dataToken;

  }

  getAuthToken = () : string => {

    let AuthHeader : string | null = "";

    //AuthHeader =  this.sessionService.getData("AuthToken");
    AuthHeader =  this.cookieService.get("AuthToken");

    return (AuthHeader) ? AuthHeader : "";
  }

  loggedUser  = () : string | null => (sessionStorage.getItem("utente")) ? sessionStorage.getItem("utente") : "";

  isLogged = () : boolean => (sessionStorage.getItem("utente")) ? true: false;

  clearUser = () : void => sessionStorage.removeItem("utente");

  clearAll = () : void => {
    this.cookieService.clear();
    sessionStorage.clear();
  }
}
