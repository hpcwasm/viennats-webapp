import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  viewProviders: [MatIconRegistry]
})
export class AppComponent {
  deviceInfo = null;

  title = 'ViennaTS- WebAssembly';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
        'myphone',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/phone.svg'));
    iconRegistry.addSvgIcon(
        'mytablet',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tablet.svg'));
    iconRegistry.addSvgIcon(
        'mydesktop',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/desktop.svg'));
    iconRegistry.addSvgIcon(
        'mydownload',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/download.svg'));
    iconRegistry.addSvgIcon(
        'myplay',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/play.svg'));
    iconRegistry.addSvgIcon(
        'mypause',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pause.svg'));
    iconRegistry.addSvgIcon(
        'mynext',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/next.svg'));
    iconRegistry.addSvgIcon(
        'myprev',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/prev.svg'));
  }
}
