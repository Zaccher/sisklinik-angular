import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { IUserapp } from '../../models/Userapp';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserappService {

  server : string = environment.serverUserappService;
  port : string = environment.portUserappService;

  constructor(private http : HttpClient, private ss: SessionService) { }

  insertUserapp(userappNew: IUserapp, file: File) : Observable<any> {

    // A causa del file, dobbiamo creare un form data con tutti i campi dello userappNew
    const formData: FormData = new FormData();
    formData.append('username', userappNew.username);
    formData.append('password', userappNew.password);
    formData.append('name', userappNew.name);
    formData.append('surname', userappNew.surname);
    formData.append('fiscalCode', userappNew.fiscalCode);
    formData.append('birthDate', userappNew.birthDate);
    formData.append('birthPlace', userappNew.birthPlace);
    formData.append('address', userappNew.address);
    formData.append('postcode', userappNew.postcode);
    formData.append('municipality', userappNew.municipality);
    formData.append('district', userappNew.district);
    formData.append('personalPhone', userappNew.personalPhone);
    formData.append('homePhone', userappNew.homePhone);
    formData.append('mailAddress', userappNew.mailAddress);
    if(userappNew.checkResource){
      formData.append('checkResource', "T");
    }
    else{
      formData.append('checkResource', "F");
    }
    formData.append('alias', userappNew.alias);

    if(file) {
      formData.append('file', file);
    }

    return this.http.post(`http://${this.server}:${this.port}/api/user/insert`, formData);

  }
}
