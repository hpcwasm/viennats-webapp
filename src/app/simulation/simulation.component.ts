import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';

import {Cancelsim2Component} from '../cancelsim2/cancelsim2.component';
import {ParametersComponent} from '../parameters/parameters.component';
import {WebworkerService} from '../services/webworker/webworker.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.sass']
})
export class SimulationComponent implements OnInit, OnDestroy {
  // @ViewChild(ParametersComponent)
  // private parameterComponent: ParametersComponent;

  subscription: Subscription;
  dialogref: MatDialogRef<Cancelsim2Component>;

  constructor(
      public webworkerService: WebworkerService, private router: Router,
      private route: ActivatedRoute, private dialog: MatDialog) {
    this.subscription =
        this.webworkerService.getParfilesReady().subscribe(message => {
          this.checkRoutes();
          this.webworkerService.updatefromRoute(this.routeID.toLowerCase());
        });
  }



  routeID: string;
  private sub: any;
  validID: boolean = false;
  isLoading: boolean = true;
  ngOnInit() {
    console.log('ngOnInit SimulationComponent');


    // Get parent ActivatedRoute of this route.
    this.sub = this.route.params.subscribe((params => {
      console.log('params');
      console.log(params);
      this.routeID = params['simpath'];
      console.log(params);
      // find if sim exisits
      this.checkRoutes();
      this.webworkerService.updatefromRoute(this.routeID.toLowerCase());
    }));
  }

  checkRoutes() {
    if (this.webworkerService.parfiles.length > 0) {
      console.log(this.routeID);
      console.log(this.webworkerService.parfiles.length);
      this.validID = false;
      this.isLoading = true;
      console.log('this.isLoading ' + this.isLoading);
      for (let idx = 0; idx != this.webworkerService.parfiles.length; ++idx) {
        // console.log(this.webworkerService.parfiles[idx].prefixpath);
        // console.log(this.routeID);
        // console.log(this.route);

        console.log(
            this.webworkerService.parfiles[idx].prefixpath.toLowerCase());
        // if valid url
        var newrouteisDiff = this.webworkerService.selectedSimIdx == undefined ?
            false :
            this.routeID.toLowerCase() !=
                this.webworkerService
                    .parfiles[this.webworkerService.selectedSimIdx]
                    .prefixpath;
        var newrouteisValid = this.routeID.toLowerCase() ==
            this.webworkerService.parfiles[idx].prefixpath.toLowerCase();
        console.log('############ newrouteisDiff ' + newrouteisDiff);
        console.log('############ newrouteisValid ' + newrouteisValid);
        if (newrouteisValid) {
          // but check if we are running
          if (this.webworkerService.status == 'running' && newrouteisDiff) {
            // console.log(
            //     '############ running something different, so, abort and
            //     reroute');
            // this.webworkerService.respawnSimulation();
            // this.webworkerService.clearResults();
            // this.webworkerService.sendClearConsoleLog();
            // this.webworkerService.loadsim(idx);
            // this.router.navigate([
            //   '/simulation', this.webworkerService.parfiles[idx].prefixpath
            // ]);


            // this.dialogref =  this.dialog.open(Cancelsim2Component);

            // this.dialogref.afterClosed().subscribe(result => {
            //   if (result == 'abort') {
            //     console.log('############ result == abort');
            //     this.webworkerService.respawnSimulation();
            //     this.webworkerService.clearResults();
            //     this.webworkerService.sendClearConsoleLog();
            //     this.webworkerService.loadsim(idx);
            //     this.router.navigate([
            //       '/simulation',
            //       this.webworkerService.parfiles[idx].prefixpath
            //     ]);
            //   } else if (result == 'continue') {
            //     console.log('############ result == continue');
            //     // route to running simulation
            //     this.router.navigate([
            //       '/simulation',
            //       this.webworkerService
            //           .parfiles[this.webworkerService.selectedSimIdx]
            //           .prefixpath
            //     ]);
            //   } else {
            //     // NOTE: The result can also be nothing if the user presses
            //     the
            //     // `esc` key or clicks outside the dialog
            //   }
            // });

            // this.validID = true;
            // break;
          } else if (
              this.webworkerService.status != 'running' &&
              this.webworkerService.status != 'exception' && newrouteisDiff) {
            // console.log('############ running nothing but new route');
            // // nothing was running so just reroute and clear results
            // this.webworkerService.clearResults();
            // this.webworkerService.sendClearConsoleLog();
            // this.webworkerService.loadsim(idx);
            // this.router.navigate([
            //   '/simulation', this.webworkerService.parfiles[idx].prefixpath
            // ]);
          } else if (
              this.webworkerService.status != 'running' &&
              this.webworkerService.status == 'exception' && newrouteisDiff) {
            // console.log('############ running nothing but new route');
            // // nothing was running so just reroute and clear results
            // this.webworkerService.respawnSimulation();
            // this.webworkerService.clearResults();
            // this.webworkerService.sendClearConsoleLog();
            // this.webworkerService.loadsim(idx);
            // this.router.navigate([
            //   '/simulation', this.webworkerService.parfiles[idx].prefixpath
            // ]);
          } else {
            // nothing was running but simid differs
            console.log('############ running nothing or running current');
            // this.webworkerService.clearResults();
            // this.webworkerService.sendClearConsoleLog();
            // this.webworkerService.loadsim(idx);
            // console.log('not running anything');
          }
          this.validID = true;
          this.isLoading = false;
          console.log('this.isLoading ' + this.isLoading);
          return;
          // url not found
        } else {
        }
      }
      this.validID = false;
      this.isLoading = false;
      console.log('this.isLoading ' + this.isLoading);
    } else {
      this.validID = false;
      this.isLoading = true;
      console.log('this.isLoading ' + this.isLoading);
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
