/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {
  currentUser: any;

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
      event.target.complete();
    }, 2000);
  }
}
