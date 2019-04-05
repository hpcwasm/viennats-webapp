import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

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

  constructor(
      public webworkerService: WebworkerService, private router: Router,
      private route: ActivatedRoute) {}

  routeID: string;
  private sub: any;
  validID: boolean = false;
  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.sub = this.route.params.subscribe((params => {
      this.routeID = params['simpath'];
      // console.log(params);
      // find if sim exisits

    }));
    for (let idx = 0; idx != this.webworkerService.parfiles.length; ++idx) {
      // console.log(this.webworkerService.parfiles[idx].prefixpath);
      // console.log(this.routeID);
      // console.log(this.route);
      if (this.webworkerService.parfiles[idx].prefixpath.toLowerCase() ==
          this.routeID.toLowerCase()) {
        // ok let's span
        this.validID = true;
        break;
      } else {
        this.validID = false;
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
