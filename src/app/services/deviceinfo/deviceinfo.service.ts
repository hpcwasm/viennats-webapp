import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class DeviceinfoService {

  wasmSupport: boolean = false;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;


  support: boolean= false;
  supportCheck: boolean = true;

  disableSupportCheck(){
    this.supportCheck = false;
  }

  
  constructor(public deviceService: DeviceDetectorService) {
    
    this.wasmSupport = this.checkwebAssemblySupport();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.isMobile = this.deviceService.isMobile();

    this.support = this.isDesktop && this.wasmSupport;
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
