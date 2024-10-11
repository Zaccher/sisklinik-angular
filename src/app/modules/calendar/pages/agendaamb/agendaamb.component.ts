import { AfterViewInit, ChangeDetectorRef, Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DayPilot, DayPilotCalendarComponent, DayPilotModule, DayPilotNavigatorComponent } from '@daypilot/daypilot-lite-angular';
import { AppuntamentiagendaService } from '../../../../core/services/appuntamentiagenda.service';
import { IAgendaResource } from '../../../../models/AgendaResource';
import { IEvent } from '../../../../models/Event';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, formatDate } from '@angular/common';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-agendaamb',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DayPilotModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './agendaamb.component.html',
  styleUrl: './agendaamb.component.css'
})
export class AgendaambComponent implements OnInit, AfterViewInit {

  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;
  @ViewChild("calendar") calendar!: DayPilotCalendarComponent;

  // Questa variabile serve a memorizzare l'id dell'evento su cui ho fatto click con il destro
  idEventSelected: string = "";

  resources$ : IAgendaResource[] = [];
  events$: DayPilot.EventData[] = [];
  errore : string = "";

  startDate: DayPilot.Date | string | undefined;
  
  // Risorsa dell'agenda selezionata
  resourceSelected: string = "";

  // Configurazione di base del calendar
  calendarConfig: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    timeFormat: "Clock24Hours",
    eventRightClickHandling: "Disabled",
    heightSpec: "BusinessHoursNoScroll",
    businessBeginsHour: 7,
    businessEndsHour: 20,
    viewType: "Resources",
    headerHeight: 100,
    columnMarginRight: 15,
    locale: "it_it",
    onBeforeHeaderRender: args => {

      const data = args.column.data;
      const header = args.header;
      header.verticalAlignment = "top";
      if (data.icon) {
        args.header.areas = [
          {
            left: "calc(50% - 30px)",
            bottom: 10,
            height: 60,
            width: 60,
            image: "/assets/images/"+data.icon,
            style: "border-radius: 40px; overflow: hidden; border: 3px solid #fff;"
          },
           {
            left: 5,
            right: 5,
            top: 95,
            height: 20,
            text: args.column.name,
            style: "display:flex;justify-content:center;align-items:center;"
          }
        ];
      }
      
    },
    onBeforeEventRender: args => { // metodo chiamato prima che l'evento sia caricato a calendario

      args.data.html = ``;
      const text = DayPilot.Util.escapeHtml(args.data.text);
      const startStamp = new DayPilot.Date(args.data.start).addHours(7).toString("HH:mm");
      const endStamp = new DayPilot.Date(args.data.end).addHours(7).toString("HH:mm");
      const start = new DayPilot.Date(args.data.start).toDate().getTime(); //.toString("HH:mm");
      const end = new DayPilot.Date(args.data.end).toDate().getTime();//.toString("HH:mm");
      const differenza = Math.floor((end - start) / (1000 * 60)) ;
      if(differenza == 30) {
        args.data.html = `<b>${text}</b>`;
      }else {
        args.data.html = `<b>${text} </b></br><b>(${startStamp} - ${endStamp})</b>`; // setta la proprietà html del DataEvent
      }

    },
    onTimeRangeSelect: async args => { // metodo startato quando si clicca su un range temporale vuoto

      this.openModal(args.resource.toString());

    },
    onEventClick: async args => {

      this.openModalEventClick(args.e.data.id.toString(), args.e.data.resource.toString());

    }
  };

  constructor(private route: Router, 
              private aas: AppuntamentiagendaService, 
              private ss: SessionService,
              @Inject(LOCALE_ID) private locale: string, 
              private cdref: ChangeDetectorRef) {

    // Mi riprendo le resource dal db e costruisco l'header del calendar
    this.aas.getAllResources().subscribe(
      {
        next: this.handleResponseAllResource.bind(this), //per le risposte positive
        error: this.handleError.bind(this) //per gli errori http
      }
    )
  }

  ngOnInit(): void {

    // Puliamo la session storage
    this.cleanSessionStorage();

  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }

  cleanSessionStorage() {

    // Togliamo dalla sessionSotrage il valore della resource selezionata
    this.ss.removeData("resourceSelected");
    this.ss.removeData("idEventSelected");
    this.ss.removeData("modalita");
    this.ss.removeData("patientSelected");

  }

  openModalEventClick(idEvent: string, idResource: string) {

    this.idEventSelected = idEvent;
    this.resourceSelected = idResource;

    const modalDiv = document.getElementById('modalEvent');

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
    }

  }

  openModal(resoruceId: string) {

    // Set resource selezionata nell'agenda
    this.resourceSelected = resoruceId;

    const modalDiv = document.getElementById('modalEvent');

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
    }
  }

  closeModal() {

    // Cancello l'id evento selezionato
    this.idEventSelected = "";

    // Cancello la resource selezionata
    this.resourceSelected = "";

    const modalDiv = document.getElementById('modalEvent');
    const modalDivDelete = document.getElementById('modalDeleteEvent');

    this.calendar.control.clearSelection();

    if(modalDiv != null) {
      modalDiv.style.display = 'none';
    }

    if(modalDivDelete != null) {
      modalDivDelete.style.display = 'none';
    }
  }

  ngAfterViewInit(): void {

    this.viewChange();

    this.cdref.detectChanges();
  }

  viewChange(): void {

    this.events$ = [];
    
    var from = this.calendar.control.visibleStart();
    var to = this.calendar.control.visibleEnd();

    this.aas.getEvents(from, to).subscribe(
      {
        next: this.handleResponseAllEvents.bind(this), //per le risposte positive
        error: this.handleError.bind(this) //per gli errori http
      }
    )

    // Settiamo la data nel DatePicker centrale
    this.startDate = formatDate((this.calendarConfig.startDate as DayPilot.Date).toString(),'yyyy-MM-dd',this.locale);

  }

  handleResponseAllEvents(response: IEvent[]) {
    
    this.events$ = response;

  }

  handleResponseAllResource(response: IAgendaResource[]) {
    
    this.resources$ = response;

    const options = {
      columns: this.resources$
    };

    this.calendar.control.update(options);
  }

  handleError(error: Object) {
    this.errore = error.toString();
  }

  navigatePrevious(event: MouseEvent): void {
    event.preventDefault();
    this.events$ = [];
    this.calendarConfig.startDate = (this.calendarConfig.startDate as DayPilot.Date).addDays(-1);
    this.startDate = this.calendarConfig.startDate.toString("yyyy-MM-dd")
  }

  navigateNext(event: MouseEvent): void {
    event.preventDefault();
    this.events$ = [];
    this.calendarConfig.startDate = (this.calendarConfig.startDate as DayPilot.Date).addDays(1);
    this.startDate = this.calendarConfig.startDate.toString("yyyy-MM-dd")
  }

  changeValueDatepicker(): void {
    this.events$ = [];
    // Bisogna trasformare una date in un dateTime (perchè la startDate del calendar è una dateTime)
    this.calendarConfig.startDate = new DayPilot.Date(this.startDate) ;
  }

  navigateToRicercaPaziente(): void {

    // Setto nella sessioneStorage l'id della resource su cui aggiungere l'appuntamento
    this.ss.saveData("resourceSelected",this.resourceSelected);

    this.route.navigate(['ricercapaziente']);
  }

  navigateToModificaEvento(): void {

    this.ss.saveData("modalita","modifica");
    this.ss.saveData("idEventSelected",this.idEventSelected);

    // Setto nella sessioneStorage l'id della resource su cui aggiungere l'appuntamento
    this.ss.saveData("resourceSelected",this.resourceSelected);

    this.route.navigate(['aggiungimodificaevento']);
  }

  navigateToEliminaEvento(): void {

    const modalDiv = document.getElementById('modalEvent');
    const modalDivDelete = document.getElementById('modalDeleteEvent');

    // Chiudo il modal del menù event
    if(modalDiv != null) {
      modalDiv.style.display = 'none';
    }

    // Apro il modal per l'eliminazione dell'evento
    if(modalDivDelete != null) {
      modalDivDelete.style.display = 'flex';
      modalDivDelete.style.alignItems = 'center';
    }
  }

  navigateToDettaglioEvento(): void {

    this.ss.saveData("modalita","soloLettura");
    this.ss.saveData("idEventSelected",this.idEventSelected);

    this.route.navigate(['aggiungimodificaevento']);
  }

  eliminaEvento(): void {
    this.aas.deleteEvent(this.idEventSelected).subscribe(
      {
        next: this.handleResponseDeleteEvent.bind(this), //per le risposte positive
        error: this.handleError.bind(this) //per gli errori http
      }
    )
  }

  handleResponseDeleteEvent(response: any) {
    
    this.closeModal();

    this.ngAfterViewInit();
    
  }
  
}
