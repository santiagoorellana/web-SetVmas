import {Component, OnInit} from '@angular/core';
import {LoadingIndicatorService} from './services/loading/loading-indicator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SetV+';
  loadComplete = false;

  

  constructor(public loadingIndicator:LoadingIndicatorService) {
    //loadingIndicator.showLoading(true);
  }

  ngOnInit(): void {
    //this.loadingIndicator.showLoading(false);
  
    this.loadComplete = true;
 
  }




}
