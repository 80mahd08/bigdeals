import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-success-msg',
    templateUrl: './success-msg.component.html',
    styleUrls: ['./success-msg.component.scss'],
    standalone: false
})

/**
 * SuccessMsg Component
 */
export class SuccessMsgComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
