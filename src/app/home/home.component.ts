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


  runsimulation(parfilename: string) {
    // check if simulation is running
    if (this.webworkerService.status == 'running') {
      let dialogRef = this.dialog.open(CancelsimComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'abort') {
          this.webworkerService.respawnSimulation();
          this.webworkerService.clearResults();
          this.webworkerService.selectedParfile = parfilename;
          this.webworkerService.sendClearConsoleLog();
          this.webworkerService.loadfile(this.webworkerService.selectedParfile);
          this.router.navigate(['/simulation']);
        } else if (result == 'continue') {
          // do nothing
        } else {
          // NOTE: The result can also be nothing if the user presses the `esc`
          // key or clicks outside the dialog
        }
      })
    } else {
      this.webworkerService.clearResults();
      this.webworkerService.selectedParfile = parfilename;
      this.webworkerService.sendClearConsoleLog();
      this.webworkerService.loadfile(this.webworkerService.selectedParfile);
      this.router.navigate(['/simulation']);
    }
  }
}
