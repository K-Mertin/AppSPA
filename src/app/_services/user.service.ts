import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_model/User';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// import { AuthHttp } from 'angular2-jwt';
import { PaginatedResult } from '../_model/pagination';
import { query } from '@angular/core/src/animation/dsl';
import { Message } from '../_model/message';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;

    // constructor(private authHttp: AuthHttp) { }
    constructor(private authHttp: HttpClient) { }

    getUsers(page?, itemsPerPage?, userParams?: any, likesParam?: string) {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        // let queryString = '?';
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            // queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (likesParam === 'Likers') {
            // queryString += 'Likers=true&';
            params = params.append('Likers', 'true');
        }

        if (likesParam === 'Likees') {
            // queryString += 'Likees=true&';
            params = params.append('Likees', 'true');
        }

        if (userParams != null) {
            params = params.append('minAge', userParams.minAge);
            params = params.append('maxAge', userParams.maxAge);
            params = params.append('gender', userParams.gender);
            params = params.append('orderBy', userParams.orderBy);
            // queryString +=
            //     'minAge=' + userParams.minAge +
            //     '&maxAge=' + userParams.maxAge +
            //     '&gender=' + userParams.gender +
            //     '&orderBy=' + userParams.orderBy;
        }

        return this.authHttp
            .get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
            // .get(this.baseUrl + 'users' + queryString)
            // .map(response => <User[]>response.json())
            // .map((response: Response) => {
            .map(response => {
                // paginatedResult.result = response.json();
                paginatedResult.result = response.body;

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            });
            // .catch(this.handlerError);
    }


    updateUser(id: number, user: User) {
        return this.authHttp.put(this.baseUrl + 'users/' + id, user);
        // .catch(this.handlerError);
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
        return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
        // .catch(this.handlerError);
    }

    deletePhoto(userId: number, id: number) {
        return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
        // .catch(this.handlerError);
    }

    getUser(id): Observable<User> {
        return this.authHttp
            .get<User>(this.baseUrl + 'users/' + id);
            // .map(response => <User>response.json())
            // .catch(this.handlerError);
    }

    sendLike(id: number, recipientId: number) {
        return this.authHttp.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
        // .catch(this.handlerError);
    }

    getMessages(id: number, page?, itemsPerPage?, messageContainer?: string) {
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
        // let queryString = '?MessageContainer=' + messageContainer;
        let params = new HttpParams();

        params = params.append('MessageContainer', messageContainer);

        if (page != null && itemsPerPage != null) {
            // queryString += '&pageNumber=' + page + '&pageSize=' + itemsPerPage;
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }


        return this.authHttp
        // .get(this.baseUrl + 'users/' + id + '/messages' + queryString)
        .get<Message[]>(this.baseUrl + 'users/' + id + '/messages',  { observe: 'response', params})
        .map((response) => {
            // paginatedResult.result = response.json();
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination')) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }
            return paginatedResult;
        });
        // .catch(this.handlerError);

    }

    getMessageThread(id: number, recipientId: number) {
        return this.authHttp.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
            // .map((response: Response) => {     return response.json();})
            // .catch(this.handlerError);
    }

    sendMessage(id: number, message: Message) {
        return this.authHttp.post<Message>(this.baseUrl + 'users/' + id + '/messages', message);
            // .map((response: Response) => {     return response.json();})
            // .catch(this.handlerError);
    }

    deleteMessage(id: number, userId: number) {
        return this.authHttp.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
            // .map(response => {})
            // .catch(this.handlerError);
    }

    markAsRead(userId: number, messageId: number) {
        return this.authHttp.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
    }

    // private handlerError(error: any) {
    //     if (error.status === 400) {
    //         return Observable.throw(error._body);
    //     }
    //     const applicationError = error.headers.get('Application-Error');
    //     if (applicationError) {
    //         return Observable.throw(applicationError);
    //     }

    //     const serverError = error.json();
    //     let modelStateErrors = '';
    //     if (serverError) {
    //         for (const key in serverError) {
    //             if (serverError[key]) {
    //                 modelStateErrors += serverError[key] + '\n';
    //             }
    //         }
    //     }
    //     return Observable.throw(
    //         modelStateErrors || 'Server error'
    //     );
    // }


}
