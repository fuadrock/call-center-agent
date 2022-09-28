import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialogue',
  templateUrl: './delete-dialogue.component.html',
  styleUrls: ['./delete-dialogue.component.scss']
})
export class DeleteDialogueComponent implements OnInit {
  data: any;

  constructor( @Inject(MAT_DIALOG_DATA) data: any,public dialogRef: MatDialogRef<DeleteDialogueComponent>) {
    this.data = data;
  }

  ngOnInit(): void {
  }

  close(status:any) {
    this.dialogRef.close('');
  }

  confirm(){
    this.dialogRef.close('confirm');
  }
}
