import { Component, OnInit } from '@angular/core';
import { Router,Routes,ActivatedRoute } from '@angular/router';
import {routes} from '../app-routing.module';
import {WebworkerService} from '../services/webworker/webworker.service';
import {Subscription} from 'rxjs';
import {DeviceinfoService} from '../services/deviceinfo/deviceinfo.service';
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.sass']
})
export class MenubarComponent implements OnInit {

  // routes: Routes = routes;
  subscription: Subscription;
  parfilesReady: boolean = false;
  constructor(public webworkerService: WebworkerService, public router: Router, public route: ActivatedRoute,public deviceinfo: DeviceinfoService) {
    this.subscription =
    this.webworkerService.getParfilesReady().subscribe(message => {
      this.parfilesReady = true;
    });
   }



  ngOnInit() {
  }

}
