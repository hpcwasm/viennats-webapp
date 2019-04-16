import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CancelsimComponent} from '../cancelsim/cancelsim.component';
import {WebworkerService} from '../services/webworker/webworker.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  constructor(
      public webworkerService: WebworkerService, private router: Router,
      private dialog: MatDialog) {
  }


  runsimulation(simidx: number) {
    // check if simulation is running
    if (this.webworkerService.status == 'running') {
      let dialogRef = this.dialog.open(CancelsimComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'abort') {
          this.router.navigate(['/simulation',this.webworkerService.parfiles[simidx].prefixpath]);
          this.webworkerService.respawnSimulation();
          this.webworkerService.clearResults();
          this.webworkerService.sendClearConsoleLog();
          this.webworkerService.loadsim(simidx);
          // this.router.navigate(['/simulation']);
          
        } else if (result == 'continue') {
          // route to running simulation
          // this.router.navigate(['/simulation']);
          this.router.navigate(['/simulation',this.webworkerService.parfiles[this.webworkerService.selectedSimIdx].prefixpath]);
        } else {
          // NOTE: The result can also be nothing if the user presses the `esc`
          // key or clicks outside the dialog
        }
      });
    } else {
      if (this.webworkerService.status == 'uninitialized'){
        this.webworkerService.respawnSimulation();
      }
      this.router.navigate(['/simulation',this.webworkerService.parfiles[simidx].prefixpath]);
      this.webworkerService.clearResults();
      this.webworkerService.sendClearConsoleLog();
      this.webworkerService.loadsim(simidx);
      // this.router.navigate(['/simulation']);
     
    }
  }
}
