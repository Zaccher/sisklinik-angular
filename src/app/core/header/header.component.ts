import { Component, OnInit } from '@angular/core';
import { AuthappService } from '../services/authapp.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(public BasicAuth: AuthappService) { }

  ngOnInit(): void {}
  
}
