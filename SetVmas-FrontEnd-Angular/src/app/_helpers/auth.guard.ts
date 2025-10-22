import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';




@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
      public router: Router,
      public authenticationService: AuthenticationService,
      public actRoute: ActivatedRoute
    ) { }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       /* const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
          // logged in so return true
            console.log('activo');
            return true;
        }*/
      var token=localStorage.getItem("token");
      if (token) {
          // logged in so return true
          return true;
      }

        // not logged in so redirect to login page with the return url
   // this.router.navigate(['/singin'], { queryParams: { returnUrl: state.url } });
    this.router.navigate(['/']);
        return false;
    }
}
