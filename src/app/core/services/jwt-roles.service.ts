import { Injectable } from '@angular/core';
import { AuthJwtService } from './authJwt.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Ruoli } from '../../models/Ruoli';

@Injectable({
  providedIn: 'root'
})
export class JwtRolesService {

  constructor(private authJwt: AuthJwtService) { }

  getRoles = () : string[] => {

    let token : string = '';
    let ruoli : string[] = new Array();
    let items : any;

    token = this.authJwt.getAuthToken();

    if(token) {
      // Creaiamo l'istanza dell tool che ci aiuterà a decodificare il token JWT
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token); // decodifichiamo il token

      // Ci prendiamo le authorities dal token
      items = decodedToken['authorities'];

      if (!Array.isArray(items))
        ruoli.push(items);
      else
        ruoli = items;
    }

    return ruoli;
  }

  isAdmin = () : boolean => {

    let admin : boolean = false;

    (this.getRoles().indexOf(Ruoli.amministratore) > -1) ? admin = true : admin = false;

    return admin;

  }
}
