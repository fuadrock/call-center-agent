import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService, private router: Router) {

  }



  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     tap({
  //       next: () => null,
  //       error: (err: HttpErrorResponse) => {
  //         if ([401, 403].includes(err.status) && !request.url.includes('auth/login')) {
  //           console.log(err);
  //         }
  //         // this.accountService.signOut(); // auto logout if 401 or 403 response returned from api

  //         const error = err.error?.message || err.status;
  //         //this.alertService.error(error);
  //         return throwError(error);
  //       },
  //     })
  //   );
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError(error => {
      console.log("ssss", error)
      if (error instanceof HttpErrorResponse && !request.url.includes('auth/login') && error.status === 401) {
        console.log("error1,", error);
       // return this.handle401Error(request, next);
      }

      return throwError(error);
    }));
  }


  // intercept(req: HttpRequest<any>,
  //   next: HttpHandler): Observable<HttpEvent<any>> {

  //     console.log("inter: ",req)

  //   return next.handle(req);
  // }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log("handler");
    let data = ''
    return this.apiService.post("auth/refresh-token", data).pipe(
      switchMap((token: any) => {
        return next.handle(this.addTokenHeader(request, token.access_token));
      }),
      catchError((err) => {
        console.log("here6");
        this.router.navigate(['/auth/login']);
        return throwError(err);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {


    return request.clone({ headers: request.headers.set("Authorization", 'Bearer ' + token) });
  }
}


