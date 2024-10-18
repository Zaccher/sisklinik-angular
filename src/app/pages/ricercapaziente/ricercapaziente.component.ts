import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Angular2SmartTableModule, DataSet, LocalDataSource, RowSelectionEvent, Settings} from 'angular2-smart-table';
import { PatientService } from '../../core/services/patient.service';
import { IPatient } from '../../models/Patient';
import { SessionService } from '../../core/services/session.service';
import moment from 'moment';
import { ExcelService } from '../../core/services/excel.service';
import autoTable, { RowInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ricercapaziente',
  standalone: true,
  imports: [RouterLink, 
            RouterLinkActive, 
            Angular2SmartTableModule, 
            FormsModule,
            CommonModule
  ],
  templateUrl: './ricercapaziente.component.html',
  styleUrl: './ricercapaziente.component.css'
})
export class RicercapazienteComponent implements OnInit, AfterViewInit {

  // Variabile per memorizzare i dati dei filtri
  patientSearch: IPatient;

  // Variabile atta a memorizzare la riga selezionata della table
  selectedRow$!: IPatient;

  // Variabile atta a identificare se la riga nella tabella è stata cliccata oppure no
  selectedRow: boolean;

  // datasource di partenza della table
  source: LocalDataSource;

  // Questo array ci servirà a gestire l'export in xlsx
  rowsResult$: IPatient[] = [];

  //Numero righe table
  countRow: number;
  
  // setting della struttura della table
  settings: Settings = {
    selectMode: "single",
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      perPage: 5,
      display: true
    },
    noDataMessage: "Nessun Risultato Disponibile",
    columns: {
      name: {
        title: 'Nome'
      },
      surname: {
        title: 'Cognome'
      },
      gender: {
        title: 'Sesso'
      },
      fiscal_code: {
        title: 'Codice Fiscale'
      },
      birth_time: {
        title: 'Data di nascita',
        type: 'text',
        valuePrepareFunction: (value) => {
          if (!value) return '';
          return moment(value).format('DD/MM/yyyy');
        }
      },
      birth_place: {
        title: 'Comune di nascita'
      },
      residence_address: {
        title: 'Indirizzo'
      }
    }
  };

  constructor(private route: Router,
              private routeActive: ActivatedRoute, 
              private location: Location,
              private es: ExcelService,
              private ps: PatientService, 
              private ss: SessionService,
              private cdref: ChangeDetectorRef) {
    
    // Inizializzo la variabile patientSearch
    this.patientSearch = {
      id: "",
      name: "",
      surname:  "",
      gender:  "",
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
      mail_address : ""
    }

    this.source = new LocalDataSource();

    this.countRow = this.source.count();

    this.selectedRow = false;

  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }

  cercaPazienti(): void {

    this.selectedRow = false;
    //this.ss.removeData("patientSelected");

    this.ps.getPatientsByParams(this.patientSearch).subscribe(result => {
      
      // Carico i dati restituiti dal servizio dentro source
      this.source.load(result);

      // Ri-conto le righe restituite dal servizio
      this.countRow = this.source.count();
    });
  }

  pulisciFiltri(): void {
    // Reset dei filtri
    this.patientSearch = {
      id: "",
      name: "",
      surname:  "",
      gender:  "",
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
      mail_address : ""
    }
  }

  // DA CONTROLALRE NEL CASO IN CUI CI SIA LA PAGINAZIONE
  rowSelect(event: RowSelectionEvent): void {
    // elimino tutti quell iselezionati tranne l'ultimo - a causa del bug
    //event.selected = event.selected.slice(-1);
  }

  // DA CONTROLALRE NEL CASO IN CUI CI SIA LA PAGINAZIONE
  userSelectedRow(event: RowSelectionEvent): void {

    if(!event.isSelected) {
      this.selectedRow = false;
      this.ss.removeData("patientSelected");
    }else {
      this.selectedRow$ = event.data;
      this.selectedRow = true;
      // converto in json l'oggetto
      var jsonPatient = JSON.stringify(this.selectedRow$);
      // Memorizzo il paziente nella sesisonStorage
      this.ss.saveData("patientSelected",jsonPatient);
    }

  }

  navigateToInserisciPaziente() {
    // Memorizzo una variabile per tracciare l'operation che voglio fare
    this.ss.saveData("operation","newPaziente");
    this.route.navigate(['aggiungimodificapaziente']);
  }

  navigateToModificaPaziente() {

  }

  navigateToInserisciEvento() {
    this.route.navigate(['aggiungimodificaevento']);
  }

  navigateToHome() {
    this.route.navigate(['agendaamb']);
  }

  navigateToBack() {
    this.location.back();
  }

  exportToExcel(): void {

    this.source.getFilteredAndSorted().then(data => {

      this.rowsResult$ = data;

      if(this.rowsResult$.length > 0) {
        const header = ["ID", "Nome", "Cognome", "Sesso", "Codice Fiscale", "Data di Nascita", "Comune di Nascita", "Indirizzo"];
        this.es.generateExcel(header, this.rowsResult$, 'Export_Ricerca_Paziente');
      }

    });

  }

  exportToPdf(): void {

    this.source.getFilteredAndSorted().then(data => {

      this.rowsResult$ = data;

      // Create a new PDF document.
      const doc = new jsPDF();

      // Aggiungiamo il logo al pdf
      var logoSisklinik = "../../../assets/images/Logo_Sisklinik.png";
      doc.addImage(logoSisklinik, 'PNG', 10, 0, 30, 30);

      // Add content to the PDF.
      doc.setFontSize(16);
      doc.text('Lista Pazienti', 15, 40);

      /* Create a table using jspdf-autotable */

      // Definisco le colonne della tabella
      const headers = [["ID", "Nome", "Cognome", "Sesso", "Codice Fiscale", "Data di Nascita", "Comune di Nascita", "Indirizzo"]];

      // Definisco l'array che conterrà i dati della tabella
      const rows : any[] = [];

      // Scorro il rowsREsult$
      this.rowsResult$.forEach((item) => {

        // Mi creo u narray di stringhe con i valori dei campi di item
        const array = [
          item.id,
          item.name,
          item.surname,
          item.gender,
          item.fiscal_code,
          item.birth_time,
          item.birth_place,
          item.residence_address
        ];

        // Aggiungo l'array al costrutto rows
        rows.push(array);

      });

      // Aggiungo la table al doc passato da parametro, definendo anche una posizione Y sul foglio
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 45
      })

      // Save the PDF.
      doc.save('Export_Ricerca_Paziente.pdf');

    });
    
  }
}
