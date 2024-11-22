import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthJwtService } from '../services/authJwt.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

  currentDate: Date = new Date();

  constructor(public authJwt: AuthJwtService) {

  }

  ngOnInit(): void {
  }

}
