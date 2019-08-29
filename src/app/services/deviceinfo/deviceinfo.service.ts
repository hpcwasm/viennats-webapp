import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DeviceinfoService {

  wasmSupport: boolean = false;
  wasmThreadsSupport: boolean = false;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;
  deviceLevel: number = 0;
  isIE: boolean = false;
  support: boolean= false;
  supportCheck: boolean = true;
  supportMessageNote: string;
  supportMessage: string;
  disableSupportCheck(){
    this.supportCheck = false;
    this.router.navigate(['/simulation']);
  }

  
  constructor(public deviceService: DeviceDetectorService,private router: Router) {
    
    this.wasmSupport = this.checkwebAssemblySupport();
    this.wasmThreadsSupport = this.checkwebAssemblyThreadsSupport();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.isMobile = this.deviceService.isMobile();
    if (this.isDesktop)this.deviceLevel = 3;
    if (this.isTablet)this.deviceLevel = 2;
    if (this.isMobile)this.deviceLevel = 1;

    // this.support = this.wasmSupport && this.deviceService.device != "iPhone";
    this.support = this.wasmSupport;
    // this.support = this.wasmSupport && this.isDesktop!;
    this.supportMessageNote = "";
    this.supportCheck = true;   
    if (this.deviceService.browser.includes("IE")) 
    {
    console.log("this.deviceService.browser=" +this.deviceService.browser)
    this.supportMessageNote = "(Internet Explorer is not supported)";
      // browser is Internet explorer
    this.support = false;
    this.isIE = true;
    } 

    if (this.support)
    {
      this.supportMessage = "Your browser is suitable."
    }
    else {
      this.supportMessage = "Your browser is not suitable."
    }
    
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
        console.log("wasm  not supported");
      }
      return false;
    })();
    return supported;
  }
  checkwebAssemblyThreadsSupport(): boolean {
    let WebAssembly = (window as any).global.WebAssembly;
    const supported = (() => {
      try {
        // let wasmMemory = new WebAssembly.Memory({initial:1024, maximum:1024, shared: true});
        // var sab = new SharedArrayBuffer(1024);
        // var int32 = new Int32Array(sab);
        // Atomics.store(int32, 0, 123); 
        // // TODO: construct minimal threaded wasm file to check support thorougly
        // if (wasmMemory.buffer instanceof SharedArrayBuffer){
        //   return true;
        // }
      } catch (e) {
        console.log("wasm threads not supported");
        console.log(e);
      }
      return false;
    })();
    return supported;
  }  

}
