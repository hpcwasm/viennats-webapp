import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {TimeoutError} from 'rxjs';

import {DeviceinfoService} from '../deviceinfo/deviceinfo.service';

@Injectable({providedIn: 'root'})
export class NosupportService implements CanActivate {
  constructor(public router: Router, public deviceinfo: DeviceinfoService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.deviceinfo.support || !this.deviceinfo.supportCheck) {
      return true;
    } else {
      this.router.navigate(['/browserinfo']);
      return false;
    }
  }
}
