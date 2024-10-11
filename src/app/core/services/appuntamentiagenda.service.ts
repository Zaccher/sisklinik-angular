import { Injectable } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEvent } from '../../models/Event';
import { IAgendaResource } from '../../models/AgendaResource';
import { SessionService } from './session.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AppuntamentiagendaService {

  server : string = environment.serverAgendaService;
  port : string = environment.portAgendaService;

  constructor(private http : HttpClient, private ss: SessionService){
  }

  getEvents = (from: DayPilot.Date, to: DayPilot.Date) => {

    /*
    let headers = new HttpHeaders(
      {Authorization: "Basic " + window.btoa(this.ss.getData("utente") + ":" + this.ss.getData("password"))}
    )*/

    return this.http.get<IEvent[]>(`http://${this.server}:${this.port}/api/getEvents?start=` + from.toString() + `&end=` + to.toString());
  }

  getEventById = (idEvent: string) => {

    return this.http.get<IEvent>(`http://${this.server}:${this.port}/api/getEventById?id=` + idEvent);
    
  }

  insertEvent(eventNew: IEvent): Observable<any> {

    return this.http.post(`http://${this.server}:${this.port}/api/event/insert`, eventNew);

  }

  updateEvent = (event: IEvent) => {

    return this.http.post<IEvent>(`http://${this.server}:${this.port}/api/event/update`, event);

  }

  deleteEvent(id: string): Observable<any> {
   
    return this.http.delete(`http://${this.server}:${this.port}/api/event/delete?id=` + id +"&username=" + this.ss.getData("utente"));

  }

  getAllResources = () => {

    /*
    let headers = new HttpHeaders(
      {Authorization: "Basic " + window.btoa(this.ss.getData("utente") + ":" + this.ss.getData("password"))}
    )*/

    return this.http.get<IAgendaResource[]>(`http://${this.server}:${this.port}/api/getResources`);
  }

}
