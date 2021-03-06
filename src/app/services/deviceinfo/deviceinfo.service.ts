import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DeviceinfoService {

  wasmSupport: boolean = false;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;
  deviceLevel: number = 0;

  support: boolean= false;
  supportCheck: boolean = true;
  supportTryAnywayMessage: string;

  disableSupportCheck(){
    this.supportCheck = false;
    this.router.navigate(['/simulation']);
  }

  
  constructor(public deviceService: DeviceDetectorService,private router: Router) {
    
    this.wasmSupport = this.checkwebAssemblySupport();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.isMobile = this.deviceService.isMobile();
    if (this.isDesktop)this.deviceLevel = 3;
    if (this.isTablet)this.deviceLevel = 2;
    if (this.isMobile)this.deviceLevel = 1;

    // this.support = this.wasmSupport && this.deviceService.device != "iPhone";
    this.support = this.wasmSupport && this.isDesktop!;
    this.supportTryAnywayMessage = "At the moment we recommend a Desktop browser with WebAssembly support";
    this.supportCheck = true;    
   }

   checkwebAssemblySupport(): boolean {
    let WebAssembly = (window as any).global.WebAssembly;
    const supported = (() => {
      try {
        if (typeof WebAssembly === 'object' &&
            typeof WebAssembly.instantiate === 'function') {
          const module = new WebAssembly.Module(
              Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
          if (module instanceof WebAssembly.Module)
            return new WebAssembly.Instance(module) instanceof
                WebAssembly.Instance;
        }
      } catch (e) {
      }
      return false;
    })();
    return supported;
  }

}
