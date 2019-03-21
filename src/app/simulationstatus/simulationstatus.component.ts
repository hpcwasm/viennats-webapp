import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSnackBar } from '@angular/material';
import { ConsoleComponent } from '../console/console.component';
import { WebworkerService } from '../services/webworker/webworker.service';

@Component({
  selector: 'app-simulationstatus',
  templateUrl: './simulationstatus.component.html',
  styleUrls: ['./simulationstatus.component.sass']
})
export class SimulationstatusComponent implements OnInit {


  @ViewChild('consoleComponent') consoleComponent: ConsoleComponent;

  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 100;


  constructor(public snackBar: MatSnackBar, public webworkerService: WebworkerService) {}

  ngOnInit() {
  }

  startSimulation(){
    // console.log("not yet implemented");
    this.webworkerService.startSimulation();
    this.openSnackBar("Simulation Running");
  }
  terminateSimulation(){
    this.webworkerService.respawnSimulation();
    // this.closeSnackBar();
  }  

  openSnackBar(message: string) {
    // let snackBarRef = this.snackBar.open(message,'');
    // snackBarRef.afterDismissed().subscribe(() => {
    // })    
  }
  
  closeSnackBar(){
    // this.snackBar.dismiss();
  }

  clearConsole(){
    this.consoleComponent.clearConsole();
  }

}
