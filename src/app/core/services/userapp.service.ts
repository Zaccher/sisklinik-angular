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

  insertUserapp(userappNew: IUserapp) : Observable<any> {

    return this.http.post(`http://${this.server}:${this.port}/api/user/insert`, userappNew);

  }
}
