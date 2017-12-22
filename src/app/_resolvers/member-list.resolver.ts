import { Resolve, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../_model/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    pageSize = 5;
    PageNumber = 1;

    constructor(private userService: UserService, private router: Router
        , private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.PageNumber, this.pageSize).catch(error => {
            this.alertify.error('problem retrieving data');
            this.router.navigate(['/members']);
            return Observable.of(null);
        });
    }

}
