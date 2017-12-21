import { Resolve, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../_model/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { Message } from '../_model/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    pageSize = 5;
    PageNumber = 1;
    messageContainer = 'Unread';

    constructor(private userService: UserService, private router: Router, private authService: AuthService
        , private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodeToken.nameid,
            this.PageNumber, this.pageSize, this.messageContainer ).catch(error => {
            this.alertify.error('problem retrieving data');
            this.router.navigate(['/members']);
            return Observable.of(null);
        });
    }

}
