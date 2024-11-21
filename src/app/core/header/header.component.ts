import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JwtRolesService } from '../services/jwt-roles.service';
import { CommonModule } from '@angular/common';
import { AuthJwtService } from '../services/authJwt.service';
import { CountdownService } from '../services/countdown.service';
import { map, Subscription, switchMap, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  countdown : string = "prova";
  subscription !: Subscription;

  constructor(public authJwt: AuthJwtService,
              public JwtRoles: JwtRolesService,
              private cdref: ChangeDetectorRef,
              private countdownService: CountdownService,
              private router: Router) {
               
  }

  ngOnInit(): void {
    this.subscription = timer(0,1000).pipe(
      map(() => this.countdownService.getCountDown())
    ).subscribe({
      next: (response) => {
        this.countdown = response;
      }
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  logOut() {
    this.authJwt.clearAll();
    this.router.navigate(['login'],{queryParams: {logout:true}});
  }
  
}
