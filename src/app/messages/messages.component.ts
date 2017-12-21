import { Component, OnInit } from '@angular/core';
import { Message } from '../_model/message';
import { Pagination, PaginatedResult } from '../_model/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService
      .getMessages(this.authService.decodeToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  deleteMessage(id: number) {
    this.alertify.confirm('are you sure to delete the mssage', () => {
      this.userService.deleteMessage(id, this.authService.decodeToken.nameid).subscribe(() => {
        this.messages.splice(_.findIndex(this.messages, { id: id }), 1);
        this.alertify.success('message has been deleted');
      }, error => {
        this.alertify.error('Failed to delete');
      });
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
