import {Component, OnInit, ViewChild} from '@angular/core';

import {ParametersComponent} from '../parameters/parameters.component';
import {WebworkerService} from '../services/webworker/webworker.service';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.sass']
})
export class SimulationComponent implements OnInit {
  // @ViewChild(ParametersComponent)
  // private parameterComponent: ParametersComponent;

  constructor(public webworkerService: WebworkerService) {}

  startSimulation(){
    // console.log("not yet implemented");
    this.webworkerService.startSimulation();
  }
  terminateSimulation(){
    this.webworkerService.respawnSimulation();
    // this.closeSnackBar();
  }  

  ngOnInit() {}
}
