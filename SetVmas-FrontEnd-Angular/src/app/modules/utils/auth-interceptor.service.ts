import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {LoadingIndicatorService} from '../../services/loading/loading-indicator.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private  loadingIndicator: LoadingIndicatorService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('token');

    let request = req;

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        this.loadingIndicator.showLoading(false);
        if (err.status === 401) {
          localStorage.clear();
          this.authenticationService.logout();
          //this.router.navigateByUrl('/');
          this.router.navigate(['/']);
        }

        return throwError( err );

      })
    );
  }
}
