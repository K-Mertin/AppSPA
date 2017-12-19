import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_model/User';
import { AlertifyService } from '../../_services/alertify.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';


@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  photoUrl: string;
  @ViewChild('editForm') editForm: NgForm;

  constructor(private route: ActivatedRoute,
    private alertify: AlertifyService,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodeToken.nameid, this.user).subscribe(next => {
      this.alertify.success('success');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });

  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }

}
