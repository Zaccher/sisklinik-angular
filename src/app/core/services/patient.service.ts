import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPatient } from '../../models/Patient';
import { SessionService } from './session.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  server : string = environment.serverAgendaService;
  port : string = environment.portAgendaService;

  constructor(private http : HttpClient, private ss : SessionService){
  }

  getPatientsByParams(patientSearch: IPatient): Observable<any> {

    return this.http.post(`http://${this.server}:${this.port}/api/getPatients`, patientSearch);

  }

  getPatientById = (idPatient: string) => {

    return this.http.get<IPatient>(`http://${this.server}:${this.port}/api/getPatientById?id=` + idPatient);
    
  }


  savePatient(patientNew: IPatient) : Observable<any> {

    patientNew.username = this.ss.getData("utente");

    return this.http.post(`http://${this.server}:${this.port}/api/patient/insert`, patientNew);

  }
}
