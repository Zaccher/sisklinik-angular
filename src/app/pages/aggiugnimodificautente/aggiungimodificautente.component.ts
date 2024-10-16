import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserapp } from '../../models/Userapp';
import { UserappService } from '../../core/services/userapp.service';

import moment from 'moment';

@Component({
  selector: 'app-aggiungimodificautente',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './aggiungimodificautente.component.html',
  styleUrl: './aggiungimodificautente.component.css'
})
export class AggiungimodificautenteComponent {

  @ViewChild('coverFilesInput') imgType!:ElementRef;

  // PArametri inerenti l'immagine che carichiamo a FE
  size:number = 0;
  width:number = 0;
  height:number = 0;
  
  // variabile atta a memorizzare l'eventuale file caricato a FE
  currentFile!: File;

  // Contenuto del modale dello Userapp
  contentModalUserapp: string = "";

  birthDateFE!: Date;

  // Successo o no dell'operazione sull'utenza
  successOperation: boolean = false;

  // Inizializzo la variabile userappNew
  userappNew: IUserapp = {
    id: "",
    username: "",
    password: "",
    name: "",
    surname: "",
    fiscalCode: "",
    birthDate: "",
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

  // metodo richiamato nel caso si scelga di check-are la checkBox a FE
  checkboxClicked() {
    if(this.userappNew.checkResource) {
      this.userappNew.checkResource = false;
    }else {
      this.userappNew.checkResource = true;
    }
  }

  // Metodo richiamato quando carichiamo un file
  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
    
    // Calcoliamo altezza e larghezza dell'iimagine caricata
    let img = new Image()
    img.src = window.URL.createObjectURL(event.target.files[0])
    img.onload = () => {
      this.size = Number(((this.currentFile.size) / 1000).toFixed(2));
      this.width = img.width;
      this.height = img.height;
      if(this.height <= 70 && this.width <= 60 && this.size <= 128){
        alert("Ottimo! L'immagine ha le caratteristiche giuste. Può essere caricata")
      } 
      else {

        alert("Siamo spiacenti, questa immagine non ha le caratteristiche previste. "+
          "Le dimensioni dell'immagine selezionata sono " + img.width +" x " + img.height + " con un peso di " + this.size + " KB. " +
          "Le dimensioni previste sono 60 x 70 con un peso di 128 KB (al massimo).");
        
        // Clear the input
        event.target.value = null;
        this.size = 0;
        this.width = 0;
        this.height = 0;
      }     
    }
  }

  salvaUtente() {

    // Se abbiamo inserito una data nascita, allora converto il valore e lo metto in userappNew
    if(this.birthDateFE){
      this.userappNew.birthDate = moment(this.birthDateFE).format('DD/MM/yyyy')
    }

    // Chiamo il metodo insertUserapp passando anche il file aggiunto
    this.us.insertUserapp(this.userappNew, this.currentFile).subscribe(
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
