import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})

/**
 * Channels Component
 */
export class ChannelsComponent implements OnInit {

  @Input() users: Array<{
    sources?: string;
    sessions?: string;
    users?: string;
    rate?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
