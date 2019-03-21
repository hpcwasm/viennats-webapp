import {Component, OnInit} from '@angular/core';
import {DeviceinfoService} from './../services/deviceinfo/deviceinfo.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Component({
  selector: 'app-browserinfo',
  templateUrl: './browserinfo.component.html',
  styleUrls: ['./browserinfo.component.sass']
})
export class BrowserinfoComponent implements OnInit {

  disableSupportCheck(){
    this.deviceinfo.disableSupportCheck();
    this.router.navigate(['/home']);
  }

  constructor(public router: Router,public deviceinfo: DeviceinfoService) {}

  ngOnInit() {}
}
