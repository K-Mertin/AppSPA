import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodeToken: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestQptions()).map((response: Response) => {
      const user = response.json();
      if (user) {
        localStorage.setItem('token', user.tokenString);
        this.decodeToken = this.jwtHelper.decodeToken(user.tokenString);
        console.log(this.decodeToken);
        this.userToken = user.tokenString;
      }
    }).catch(this.handlerError);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model, this.requestQptions()).catch(this.handlerError);
  }

  loggedIn() {
   return tokenNotExpired('token');
  }

  private requestQptions() {
    const headers = new Headers({ 'Content-type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return new RequestOptions({ headers: headers });
  }

  private handlerError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return Observable.throw(applicationError);
    }

    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return Observable.throw(
      modelStateErrors || 'Server error'
    );
  }

}
