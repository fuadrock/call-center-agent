import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ContactAddDialogueComponent } from '../contact-add-dialogue/contact-add-dialogue.component';
import { DeleteDialogueComponent } from '../delete-dialogue/delete-dialogue.component';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 1;
  size = 10;
  pageLength = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageSort: any;

  submitted: boolean = false;
  contacts: any = [];
  subscribe: Subscription;
  total = 0;

  constructor(private apiService: ApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getContact();
  }

  getContact() {
    let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;

    this.spinner.show();
    this.subscribe = this.apiService.get('auth/contacts' + pagination).subscribe(
      (res) => {
        this.contacts = res.contacts.data;
        this.pageLength = res.contacts.total;
        this.total = res.contacts.total;
        this.spinner.hide();
      },

      (err) => {
        this.toastr.error('Failed to fetch contacts!', 'Failed!');
        this.spinner.hide();
      }
    )
  }

  addContact() {
    const dialogRef = this.dialog.open(ContactAddDialogueComponent, {
      height: '630px',
      width: '800px',

    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res);
        if (res == 'add') {
          this.getContact();
        }
      }
    )
  }


  edit(contact: any) {
    const dialogRef = this.dialog.open(ContactAddDialogueComponent, {
      height: '630px',
      width: '800px',
      data: contact,
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res);
        if (res == 'add') {
          this.getContact();
        }
      }
    )
  }

  delete(contact: any) {
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {

      data: { type: 'contact', value: contact.first_name + ' ' + contact.last_name },
    });


    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res);
        if (res == 'confirm') {
          this.spinner.show();
          this.subscribe = this.apiService.delete('auth/contacts/' + contact.id).subscribe(
            (res) => {
              this.getContact();
              this.toastr.success('Success deleting contact!', 'Success!');
            },

            (err) => {
              this.toastr.error('Failed to delete contacts!', 'Failed!');
              this.spinner.hide();
            }
          ) }
      }
    )
  }


  onPaginateChange(event: any) {

    this.size = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getContact();
  }
}
