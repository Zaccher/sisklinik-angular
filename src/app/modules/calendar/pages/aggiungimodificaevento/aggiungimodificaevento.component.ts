import { CommonModule, Location} from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';
import { IEvent } from '../../../../models/Event';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { IPatient } from '../../../../models/Patient';
import { AppuntamentiagendaService } from '../../../../core/services/appuntamentiagenda.service';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-aggiungimodificaevento',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './aggiungimodificaevento.component.html',
  styleUrl: './aggiungimodificaevento.component.css'
})
export class AggiungimodificaeventoComponent implements OnInit, AfterViewInit {

  // Variabile che ci serve a capire la modalità di ingaggio alla pagina
  modalita: string = "";

  // Variabili che servono per identificare la modalità della pagina
  soloLettura: boolean = false;
  modifica: boolean = false;

  // Questo è l'id dell'evento che serve nella modalità "Solo Lettura" e "Modifica"
  idEventSelected: string = "";

  // Contenuto del modale del Patient
  contentModalEvent: string = "";

  // Successo o no dell'operazione sull'evento
  successOperation: boolean = false;

  //Questo serve per visualizzare l'eventuale controllo per le date
  erroreControlloDate: string = "";

  // Queste mi servono per gestire il lasso temporale dell'evento
  dataInizioEvento: string = "";
  dataFineEvento: string = "";
  oraInizioEvento: string = "07:00";
  oraFineEvento: string = "07:00";

  // Inizializzo l'evento che viene modellizzato dal FE
  eventNew: IEvent = {
    id: "",
	  start: "" ,
	  end: "", 
	  barColor: "#6aa84f", //verde
	  text: "" ,
	  note: "" ,
	  resource: "",
    patient: "",
    resizeDisabled: true,
    moveDisabled: true
  }

  // Inizializzo il paziente che viene modellizzato dal FE
  patientSelected: IPatient = {
    id: "",
    name: "",
    surname:  "",
    gender:  "M",
    fiscal_code:  "",
    birth_time:  "",
    birth_place: "",
    residence_address: "",
    residence_postcode: "",
    residence_municipality: "",
    residence_district: "",
    home_address: "",
    home_postcode: "",
    home_municipality: "",
    home_district: "",
    home_phone: "",
    personal_phone: "",
    mail_address : "",
    username : ""
  }

  constructor(private route: Router, 
              private routerActive: ActivatedRoute, 
              private location: Location,
              private ss: SessionService,
              private as: AppuntamentiagendaService,
              private ps: PatientService,
              private cdref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    
    this.modalita = this.ss.getData("modalita");

    if(this.modalita) {
      // Dati per pagina Dettaglio Evento
      if(this.modalita == "soloLettura") {
        this.soloLettura = true;
        this.modifica = false;
      }else {
        this.soloLettura = false;
        this.modifica = true;
      }
      this.idEventSelected = this.ss.getData("idEventSelected");
      if(this.idEventSelected) {
        // Mi riprendo l'evento dal DB
        this.as.getEventById(this.idEventSelected).subscribe( response =>
          {
            this.eventNew = response;

            // Sistemiamo le date a FE
            const dataInizio =  (new DayPilot.Date(this.eventNew.start)).addHours(7).toString();
            var splitted = dataInizio.split("T");
            this.dataInizioEvento = splitted[0];
            this.oraInizioEvento = splitted[1].substring(0,5);

            const dataFine =  (new DayPilot.Date(this.eventNew.end)).addHours(7).toString();
            var splittedFine = dataFine.split("T");
            this.dataFineEvento = splittedFine[0];
            this.oraFineEvento = splittedFine[1].substring(0,5);

            // Mi riprendo il patient dal DB
            this.ps.getPatientById(this.eventNew.patient).subscribe( response =>
              {
                this.patientSelected = response;
              }
            );
          }
        );
      }

    }else {
      var item = this.ss.getData("patientSelected");
      this.patientSelected = JSON.parse(item);
    }
  }

  ngAfterViewInit(): void {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  salvaEvent() {

    const dataInizio = this.dataInizioEvento.concat("T").concat(this.oraInizioEvento).concat(":00");
    const dataFine = this.dataFineEvento.concat("T").concat(this.oraFineEvento).concat(":00");
    const dataInizioConvert = new DayPilot.Date(dataInizio);
    const dataFineConvert = new DayPilot.Date(dataFine);

    this.controllaDateEvento(dataInizioConvert,dataFineConvert);

    if(!this.erroreControlloDate) {
      this.eventNew.start = dataInizioConvert;
      this.eventNew.end = dataFineConvert;
      this.eventNew.resource = this.ss.getData("resourceSelected");
      this.eventNew.patient = this.patientSelected.id;
      if(!this.modifica) { 
        this.as.insertEvent(this.eventNew).subscribe(
          {
            next: this.handleResponse.bind(this),
            error: this.handleError.bind(this)
          }
        );
      }else {
        this.as.updateEvent(this.eventNew).subscribe(
          {
            next: this.handleResponse.bind(this),
            error: this.handleError.bind(this)
          }
        );
      }
    }
  }

  controllaDateEvento(dataInizioConvert: DayPilot.Date, dataFineConvert: DayPilot.Date) {
    
    if(dataInizioConvert > dataFineConvert) {
      this.erroreControlloDate = "La Data Inizio Evento deve essere minore della Data Fine Evento";
    }else if(dataInizioConvert == dataFineConvert) {
      this.erroreControlloDate = "La Data Inizio Evento e la Data Fine Evento non possono essere uguali";
    }else {
      this.erroreControlloDate = "";
    }
  }

  navigateToHome() {
    this.route.navigate(['agendaamb']);
  }

  navigateToBack() {
    this.location.back();
  }

  closeModal() {

    const modalDiv = document.getElementById('modalEvent');

    if(modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  handleResponse(response: any) {
    
    const modalDiv = document.getElementById('modalEvent');

    this.contentModalEvent = response.result;
    this.successOperation = true;

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
      modalDiv.style.color = 'green';
    }
  }

  handleError(error: Object) {
    
    const modalDiv = document.getElementById('modalEvent');

    this.contentModalEvent = "Errore Operazione Evento: Contattare l'assistenza!";
    this.successOperation = false;

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
      modalDiv.style.color = 'red';
    }
  }

}
