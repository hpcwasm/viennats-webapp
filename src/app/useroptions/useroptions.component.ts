import { Component, OnInit } from '@angular/core';
import {WebworkerService} from '../services/webworker/webworker.service';
import {DeviceinfoService} from '../services/deviceinfo/deviceinfo.service';
@Component({
  selector: 'app-useroptions',
  templateUrl: './useroptions.component.html',
  styleUrls: ['./useroptions.component.sass']
})
export class UseroptionsComponent implements OnInit {

  devicelevel = "1";

  constructor(public webworkerService: WebworkerService,public deviceinfo: DeviceinfoService) { 

    if(this.webworkerService.showSimulationsLevel >0 )
    this.devicelevel = this.webworkerService.showSimulationsLevel.toString();
    else
    this.devicelevel = this.deviceinfo.deviceLevel.toString();
    
    
  }

  ngOnInit() {
  }

  updateDevicelevel (){
    this.webworkerService.showSimulationsLevel = Number(this.devicelevel );
  }
}
