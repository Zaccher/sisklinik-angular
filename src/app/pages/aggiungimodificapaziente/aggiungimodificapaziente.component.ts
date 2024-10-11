import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IPatient } from '../../models/Patient';
import { CommonModule, Location } from '@angular/common';
import { SessionService } from '../../core/services/session.service';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-aggiungimodificapaziente',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './aggiungimodificapaziente.component.html',
  styleUrl: './aggiungimodificapaziente.component.css'
})
export class AggiungimodificapazienteComponent implements OnInit, AfterViewInit {

  // Contenuto del modale del Patient
  contentModalPatient: string = "";

  successOperation: boolean = false;

  // Inizializzo la variabile patientSearch
  patientNew: IPatient = {
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
              private ps: PatientService) {

  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  calcolaCf() {

  }

  salvaPaziente() {

    this.ps.savePatient(this.patientNew).subscribe(
      {
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this)
      }
    )

  }

  navigateToHome() {
    this.route.navigate(['agendaamb']);
  }

  navigateToBack() {

    const modalDiv = document.getElementById('modalPatient');

    // Se il modale di conferma operazione è visibile, lo nascondiamo
    if(modalDiv != null) {
      if(modalDiv.style.display != 'none') {
        modalDiv.style.display = 'none';
      }
    }

    // Andiamo indietro
    this.location.back();
  }

  handleResponse(response: any) {
    
    const modalDiv = document.getElementById('modalPatient');

    this.contentModalPatient = response.result;
    this.successOperation = true;

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
      modalDiv.style.color = 'green';
    }

  }

  handleError(error: Object) {
    
    const modalDiv = document.getElementById('modalPatient');

    this.contentModalPatient = "Errore Operazione Paziente: Contattare l'assistenza!";
    this.successOperation = false;

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
      modalDiv.style.color = 'red';
    }
  }

  closeModal() {

    const modalDiv = document.getElementById('modalPatient');

    if(modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }
}
