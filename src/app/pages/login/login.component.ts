import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthJwtService } from '../../core/services/authJwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  userId : string = "";
  password : string = "";
  expired : boolean = false;

  autenticato : boolean = true;
  notlogged : boolean = false;
  filter$: Observable<string | null> = of("");
  expired$: Observable<string | null> = of("");

  errMsg : string = 'Spiacente, lo username o la password sono errati!';
  errMsg2: string = "Spiacente, devi autenticarti per poter accedere alla pagina selezionata!";
  errMsg3: string = "Sessione Scaduta! Eserguire nuovamente l'accesso!";

  constructor(private route: Router, 
              private activeRoute: ActivatedRoute, 
              private JwtAuth: AuthJwtService) { }

  ngOnInit(): void {

    this.filter$ = this.activeRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('nologged')),
    );
    this.filter$.subscribe(param => (param) ? this.notlogged = true : this.notlogged = false);

    this.expired$ = this.activeRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('expired')),
    );
    this.expired$.subscribe(param => (param) ? this.expired = true : this.expired = false);

  }

  ngAfterViewInit(): void {

    if(this.JwtAuth.isLogged()) {
      this.route.navigate(['agendaamb']);
    }

  }

  gestAuth = () => {

    this.JwtAuth.autenticaService(this.userId, this.password).subscribe({

      next: (response) => {

        this.autenticato = true;
        this.route.navigate(['agendaamb']);

      },
      error: (error) => {

        this.autenticato = false;

      }
    });
  }
}
