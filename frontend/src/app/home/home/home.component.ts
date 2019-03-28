import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() // public dataService: DataService
  {}
  public id: string = '';
  ngOnInit() {
    // this.dataService.subscribedCommunity.subscribe(id => (this.id = id));
  }
}
