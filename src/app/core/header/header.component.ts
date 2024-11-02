import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JwtRolesService } from '../services/jwt-roles.service';
import { CommonModule } from '@angular/common';
import { AuthJwtService } from '../services/authJwt.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(public authJwt: AuthJwtService,
              public JwtRoles: JwtRolesService,
              private cdref: ChangeDetectorRef) {
               
  }

  ngOnInit(): void {}

  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }
  
}
