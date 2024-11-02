import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';

import { AuthJwtService } from './authJwt.service';
import { JwtRolesService } from './jwt-roles.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private AuthJwt: AuthJwtService,
              private JwtRoles: JwtRolesService, 
              private route: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      if (!this.AuthJwt.isLogged()) {
        console.log("Accesso NON Consentito");
        this.route.navigate(['login'],{ queryParams: {nologged: true}});

        return false;
      }
      else {
        let roles : string[] = new Array();
        // Ci riprendiamo i ruoli che dovrà avere il nostro utente dal file app.routes.ts
        roles = next.data['roles'];

        if (roles === null || roles.length === 0) {
          return true;
        }
        else if (this.JwtRoles.getRoles().some(r => roles.includes(r))) {
          return true;
        }
        else {
          this.route.navigate(['forbidden']);
          return false;
        }
      }
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(RouteGuardService).canActivate(next, state);
}
