import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {ConsoleComponent} from '../console/console.component';
import {WebworkerService} from '../services/webworker/webworker.service';

@Component({
  selector: 'app-simulationstatus',
  templateUrl: './simulationstatus.component.html',
  styleUrls: ['./simulationstatus.component.sass']
})
export class SimulationstatusComponent implements OnInit, OnDestroy {
  @ViewChild('consoleComponent') consoleComponent: ConsoleComponent;

  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 100;

  parentRouteId: string;
  private sub: any;

  constructor(
      public snackBar: MatSnackBar, public webworkerService: WebworkerService,
      private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.sub = this.route.parent.params.subscribe((params => {
      this.parentRouteId = params['simpath'];
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  startSimulation() {
    // console.log("not yet implemented");
    this.webworkerService.startSimulation();
    this.openSnackBar('Simulation Running');
  }
  terminateSimulation() {
    this.webworkerService.respawnSimulation();
    // this.closeSnackBar();
  }

  openSnackBar(message: string) {
    // let snackBarRef = this.snackBar.open(message,'');
    // snackBarRef.afterDismissed().subscribe(() => {
    // })
  }

  closeSnackBar() {
    // this.snackBar.dismiss();
  }

  clearConsole() {
    this.consoleComponent.clearConsole();
  }
}
