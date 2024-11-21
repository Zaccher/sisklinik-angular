import { Injectable } from '@angular/core';
import { AuthJwtService } from './authJwt.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor(private authJwt: AuthJwtService) { }

  getCountDown = () : string => {

    let token : string = '';
    let exp : any; // parametro exp dentro il token

    var expNumber : number; // parametro exp convertito in number

    var result : string = "Time Session: ";

    token = this.authJwt.getAuthToken();

    if(token) {

      // Creaiamo l'istanza dell tool che ci aiuterà a decodificare il token JWT
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token); // decodifichiamo il token

      // Ci prendiamo le authorities dal token
      exp = decodedToken['exp'];
      expNumber = exp as number;

      var countDownDate = new Date(expNumber*1000).getTime();

        // Get today's date and time
      var now = new Date().getTime();
        
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
        
      // Time calculations for days, hours, minutes and seconds
      //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      //var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      // Output the result in an element with id="demo"
      result = result +  minutes + "m " + seconds + "s  ";
        
      // If the count down is over, write some text 
      if (distance < 0) {
        //clearInterval(x);
        result = "Time Session: EXPIRED";
      }

    }

    return result;
  }
}
