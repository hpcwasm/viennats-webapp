import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
// import {Terminal} from 'xterm';
// import {Terminal} from 'xterm/lib/xterm';
import {Terminal} from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

import {WebworkerService} from '../services/webworker/webworker.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.sass'],
  host: {'(window:resize)': 'onResize($event)'}
})
export class ConsoleComponent implements OnInit, OnDestroy {
  public term: Terminal;
  container: HTMLElement;
  subscription: Subscription;
  subscriptionclearConsole: Subscription;

  @ViewChild('xtermDIV') xtermDIV: ElementRef;
  constructor(public webworkerService: WebworkerService) {
    this.subscription =
        this.webworkerService.getConsoleLine().subscribe(message => {
          // console.log("getConsoleLine()");
          // console.log(message);
          if (message.isred == true) {
            this.printlineRED(message.text);
          } else {
            this.printline(message.text);
          }
        });
    // clear console listener
    this.subscriptionclearConsole =
        this.webworkerService.gerClearConsoleLog().subscribe(message => {
          this.clearConsole();
        });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    fit.fit(this.term);
  }
  ngOnInit() {
    Terminal.applyAddon(fit);
    this.term = new Terminal();

    this.term.open(this.xtermDIV.nativeElement);
    // this.term.setOption('fontFamily', 'Roboto Mono');
    // this.term.setOption('theme', LIGHT_THEME);
    this.term.setOption(
        'theme',
        {cursor: '#ffffff', background: '#ffffff', foreground: '#000000'});
    this.term.setOption('fontSize', '10');
    // this.term.setOption('theme', { background: '#fdf6e3' });
  }
  onResize(event) {
    console.log('resize');
    // this.term.fit();
  }

  printline(line: string) {
    this.term.writeln(line);
  }

  printlineRED(line: string) {
    this.term.writeln('\u001b[31m' + line + '\u001b[30m');
  }

  clearConsole() {
    this.term.clear();
    this.term.writeln('cleared');
  }
}
