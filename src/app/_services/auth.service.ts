import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
// import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { User } from '../_model/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthUser } from '../_model/authUser';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  baseUrl = environment.apiUrl;
  userToken: any;
  decodeToken: any;
  currentUser: User;
  // jwtHelper: JwtHelper = new JwtHelper();
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient, private jwtHelpService: JwtHelperService) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    // return this.http.post(this.baseUrl + 'login', model, this.requestQptions())
    return this.http.post<AuthUser>(this.baseUrl + 'auth/login', model, { headers: new HttpHeaders()
      .set('Content-Type', 'application/json') })
      // .map((response: Response) => {
      //   const user = response.json();
      .map(user => {
        if (user) {
          localStorage.setItem('token', user.tokenString);
          localStorage.setItem('user', JSON.stringify(user.user));
          // this.decodeToken = this.jwtHelper.decodeToken(user.tokenString);
          this.decodeToken = this.jwtHelpService.decodeToken(user.tokenString);
          this.currentUser = user.user;
          this.userToken = user.tokenString;
          if (this.currentUser.photoUrl !== null) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          } else {
            this.changeMemberPhoto('../../assets/user.png');
          }

        }
      }).catch(this.handlerError);
  }

  register(user: User) {
    // return this.http.post(this.baseUrl + 'register', user, this.requestQptions()).catch(this.handlerError);
    return this.http.post(this.baseUrl + 'auth/register', user, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
      .catch(this.handlerError);
  }

  loggedIn() {
    // return tokenNotExpired('token');
    const token = this.jwtHelpService.tokenGetter();

    if (!token) { return false; }

    return !this.jwtHelpService.isTokenExpired(token);

  }

  // private requestQptions() {
  //   const headers = new Headers({ 'Content-type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  //   return new RequestOptions({ headers: headers });
  // }

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
