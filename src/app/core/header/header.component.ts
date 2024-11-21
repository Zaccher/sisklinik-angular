import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JwtRolesService } from '../services/jwt-roles.service';
import { CommonModule } from '@angular/common';
import { AuthJwtService } from '../services/authJwt.service';
import { CountdownService } from '../services/countdown.service';
import { map, Subscription, switchMap, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
              private countdownService: CountdownService) {
               
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
  
}
