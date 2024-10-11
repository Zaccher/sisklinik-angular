import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthappService } from '../../core/services/authapp.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  userId : string = "";
  password : string = "";

  autenticato : boolean = true;
  notlogged : boolean = false;
  filter$: Observable<string | null> = of("");

  errMsg : string = 'Spiacente, la userid o la password sono errati!';
  errMsg2: string = "Spiacente, devi autenticarti per poter accedere alla pagina selezionata!";

  constructor(private route: Router, private activeRoute: ActivatedRoute, private BasicAuth: AuthappService) { }

  ngOnInit(): void {
    this.filter$ = this.activeRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('nologged')),
    );

    this.filter$.subscribe(param => (param) ? this.notlogged = true : this.notlogged = false);
  }

  gestAuth = () => {

    if (this.BasicAuth.autentica(this.userId, this.password)) {

      this.route.navigate(['agendaamb']);
      this.autenticato = true;

    } else {

      this.autenticato = false;

    }
  }
}
