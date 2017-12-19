import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_model/User';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;

    constructor(private authHttp: AuthHttp) { }

    getUsers(): Observable<User[]> {
        return this.authHttp
            .get(this.baseUrl + 'users')
            .map(response => <User[]>response.json())
            .catch(this.handlerError);
    }


    updateUser(id: number, user: User) {
        return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handlerError);
    }
    // private jwt() {
    //     let token = localStorage.getItem('token');
    //     if (token) {
    //         let headers = new Headers({ 'Authorization': 'Bearer ' + token });
    //         headers.append('Content-type', 'application/json');
    //         return new RequestOptions({ headers: headers });
    //     }
    // }

    setMainPhoto(userId: number, id: number) {
        return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}).catch(this.handlerError);
    }

    deletePhoto(userId: number, id: number) {
        return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id ).catch(this.handlerError);
    }

    getUser(id): Observable<User> {
        return this.authHttp
            .get(this.baseUrl + 'users/' + id)
            .map(response => <User>response.json())
            .catch(this.handlerError);
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
