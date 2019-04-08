import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.sass']
})
export class SimulationComponent implements OnInit, OnDestroy {
  // @ViewChild(ParametersComponent)
  // private parameterComponent: ParametersComponent;

  subscription: Subscription;

  constructor(
      public webworkerService: WebworkerService, private router: Router,
      private route: ActivatedRoute, private dialog: MatDialog) {
    this.subscription =
        this.webworkerService.getParfilesReady().subscribe(message => {
          this.checkRoutes();
        });
  }

  routeID: string;
  private sub: any;
  validID: boolean = false;
  ngOnInit() {
    console.log('ngOnInit SimulationComponent');


    // Get parent ActivatedRoute of this route.
    this.sub = this.route.params.subscribe((params => {
     console.log("params");
      console.log(params);
      this.routeID = params['simpath'];
      console.log(params);
      // find if sim exisits
      this.checkRoutes();
    }));
  }

  checkRoutes() {
    console.log(this.routeID);
    console.log(this.webworkerService.parfiles.length);
    this.validID = false;
    for (let idx = 0; idx != this.webworkerService.parfiles.length; ++idx) {
      // console.log(this.webworkerService.parfiles[idx].prefixpath);
      // console.log(this.routeID);
      // console.log(this.route);

      console.log(this.webworkerService.parfiles[idx].prefixpath.toLowerCase());
      if (this.webworkerService.parfiles[idx].prefixpath.toLowerCase() ==
          this.routeID.toLowerCase()) {
        // but check if we are running
        if (this.webworkerService.status == 'running') {
          console.log('############ running something');
          let dialogRef = this.dialog.open(CancelsimComponent);
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'abort') {
              this.webworkerService.respawnSimulation();
              this.webworkerService.clearResults();
              this.webworkerService.sendClearConsoleLog();
              this.webworkerService.loadsim(idx);
              this.router.navigate([
                '/simulation', this.webworkerService.parfiles[idx].prefixpath
              ]);
            } else if (result == 'continue') {
              // route to running simulation
              this.router.navigate([
                '/simulation',
                this.webworkerService
                    .parfiles[this.webworkerService.selectedSimIdx]
                    .prefixpath
              ]);
            } else {
              // NOTE: The result can also be nothing if the user presses the
              // `esc` key or clicks outside the dialog
            }
          });

        } else {
          // nothing was running by simid differs
          console.log('loading different sim id');
          this.webworkerService.clearResults();
          this.webworkerService.sendClearConsoleLog();
          this.webworkerService.loadsim(idx);
          console.log('not running anything');
        }
        this.validID = true;
        break;
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  startSimulation() {
    // console.log("not yet implemented");
    this.webworkerService.startSimulation();
  }
  terminateSimulation() {
    this.webworkerService.respawnSimulation();
    // this.closeSnackBar();
  }
}
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';

import {CancelsimComponent} from '../cancelsim/cancelsim.component';
import {ParametersComponent} from '../parameters/parameters.component';
import {WebworkerService} from '../services/webworker/webworker.service';
