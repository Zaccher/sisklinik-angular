import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserapp } from '../../models/Userapp';
import { UserappService } from '../../core/services/userapp.service';

@Component({
  selector: 'app-aggiungimodificautente',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './aggiungimodificautente.component.html',
  styleUrl: './aggiungimodificautente.component.css'
})
export class AggiungimodificautenteComponent {

  // Contenuto del modale dello Userapp
  contentModalUserapp: string = "";

  // Successo o no dell'operazione sull'utenza
  successOperation: boolean = false;

  // Inizializzo la variabile patientSearch
  userappNew: IUserapp = {
    id: "",
    username: "",
    password: "",
    name: "",
    surname: "",
    fiscalCode: "",
    birthDate: new Date(),
    birthPlace: "",
    address: "",
    postcode: "",
    municipality: "",
    district: "",
    personalPhone: "",
    homePhone: "",
    mailAddress : "",
    checkResource: false,
    alias: ""
  }

  constructor(private route: Router, 
              private location: Location,
              private us: UserappService){

  }

  navigateToHome() {
    this.route.navigate(['agendaamb']);
  }

  navigateToBack() {

    // Andiamo indietro
    this.location.back();

  }

  closeModal() {

    const modalDiv = document.getElementById('modalUser');

    if(modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  checkboxClicked() {
    if(this.userappNew.checkResource) {
      this.userappNew.checkResource = false;
    }else {
      this.userappNew.checkResource = true;
    }
  }

  salvaUtente() {
    console.log(this.userappNew);

    this.us.insertUserapp(this.userappNew).subscribe(
      {
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this)
      }
    );

  }

  handleResponse(response: any) {
    
    const modalDiv = document.getElementById('modalUser');

    this.contentModalUserapp = response.result;
    this.successOperation = true;

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
      modalDiv.style.color = 'green';
    }
  }

  handleError(error: any) {
    
    const modalDiv = document.getElementById('modalUser');

    this.contentModalUserapp = error.error.message;
    this.successOperation = false;

    if(modalDiv != null) {
      modalDiv.style.display = 'flex';
      modalDiv.style.alignItems = 'center';
      modalDiv.style.color = 'red';
    }
  }

}
