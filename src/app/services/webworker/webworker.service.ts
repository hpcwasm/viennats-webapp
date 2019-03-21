import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ResultsComponent} from 'src/app/results/results.component';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';


export interface ParFile {
  value: string;
  viewValue: string;
  imagepath: string;
  description: string;
}
class ParFileClass implements ParFile{
  constructor(public value: string, public viewValue: string, public imagepath: string, public description: string){}
}

export class Result {
  constructor(
      public vtkfile: string, public filename: string, public selected: boolean,
      public actor: vtkActor) {}
}


@Injectable({providedIn: 'root'})
export class WebworkerService {
  parfiles: ParFile[] = [];
  // parfiles: ParFile[] = [
  //   {value: './assets/simulations/parwasm_Deposition2D.txt', viewValue: 'Deposition 2D', imagepath: './assets/simulations/parwasm_Deposition2D.png', description: 'This is a short description of this simulation.'},
  //   {value: './assets/simulations/parwasm_Deposition3D.txt', viewValue: 'Deposition 3D', imagepath: './assets/simulations/parwasm_Deposition3D.png', description: 'This is a short description of this simulation.'},    
  //   {value: './assets/simulations/parwasm_SF6_Etching.txt', viewValue: 'SF6 Etching', imagepath: './assets/simulations/parwasm_SF6_Etching.png', description: 'This is a short description of this simulation.'},
  //   {value: './assets/simulations/parwasm_CFx_Deposition.txt', viewValue: 'CFx Deposition', imagepath: './assets/simulations/parwasm_CFx_Deposition.png', description: 'This is a short description of this simulation.'},
  //   {value: './assets/simulations/parwasm_TEOS_Deposition.txt', viewValue: 'TEOS Deposition', imagepath: './assets/simulations/parwasm_TEOS_Deposition.png', description: 'This is a short description of this simulation.'},
  // ];
  

  //  selectedParfile: string = undefined;
  selectedParfile: string;

  results: Result[] = [];

  simulationWorkerFilePath: string = './assets/buildwasm/vtsworker.js';
  simulationWorker: any = undefined;

  // other components will depend on this string
  public status: string = undefined;  // "initializing", "terminating",
                                      // "running", "idle", "exception"

  getStatusColor(status: string): string {
    switch (status) {
      case 'idle': {
        return 'green';
      }
      case 'exception': {
        return 'red';
      }
      case 'initializing': {
        return 'orange';
      }
      case 'terminating': {
        return 'fuchsia';
      }
      case 'running': {
        return 'blue';
      }
    }
    return 'black';
  }

  simulationFinished: EventEmitter<any> = new EventEmitter();
  simulationStarted: EventEmitter<any> = new EventEmitter();
  exceptionInCPP: EventEmitter<any> = new EventEmitter();
  initializationStarted: EventEmitter<any> = new EventEmitter();
  runtimeReady: EventEmitter<any> = new EventEmitter();
  resultReady: EventEmitter<any> = new EventEmitter();
  // stdoutReady: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.getSimulations().subscribe(data => 
    {
      console.log("received database.json");
      console.log(data);
      for (let example of data.examples) {
        this.parfiles.push(new ParFileClass(example.value, example.viewValue, example.imagepath, example.description));
      }
      this.selectedParfile = this.parfiles[0].value;
      this.loadfile(this.selectedParfile);
      this.initializeSimulation();
    }
    );    
    
    
  }

  clearResults() {
    this.results = [];
    this.sendResultsCleared();
  }

  // clear results view
  private resultscleared = new Subject<any>();
  sendResultsCleared() {
    this.resultscleared.next(true);
  }
  getResulstCleared(): Observable<any> {
    return this.resultscleared.asObservable();
  }  

  // clear console log
  private clearConsoleLog = new Subject<any>();
  sendClearConsoleLog() {
    this.clearConsoleLog.next(true);
  }
  gerClearConsoleLog(): Observable<any> {
    return this.clearConsoleLog.asObservable();
  }  

  initializeSimulation() {
    if (!this.simulationWorker) {
      this.initializationStarted.next(true);
      this.status = 'initializing';
      this.simulationWorker = new Worker(this.simulationWorkerFilePath);
      this.onmessage();
    }
  }
  respawnSimulation() {
    if (this.simulationWorker) {
      this.status = 'terminating';
      this.simulationWorker.terminate();
      this.simulationWorker = undefined;
      this.initializeSimulation();
    }
  }

  parfilecontent: string = '// empty parameter file';

  loadfile(filepath: string) {
    this.http.get(filepath, {responseType: 'text'})
        .subscribe(
            data => {
              console.log(data);
              this.parfilecontent = data;
            },
            error => {
              console.log('error loading parameter file ' + filepath);
              this.parfilecontent =
                  '// error loading parameter file ' + filepath;
            });
  }

  public getSimulations(): Observable<any> {
    return this.http.get("./assets/simulations/database.json");
}

  startSimulation() {
    this.clearResults();
    var runsimdata: any = {'parfilestring': this.parfilecontent};
    this.status = 'running';
    this.simulationStarted.next(true);
    this.postMessage(runsimdata);
  }

  postMessage(data: any): void {
    this.simulationWorker.postMessage(data);
  }

  onmessage(): void {
    this.simulationWorker.onmessage = function(data: any) {
      // process message from worker
      if (data.data.runtimeready === true) {
        console.log('(main) message received: runtimeready');
        this.status = 'idle';
        this.runtimeReady.next(true);

      } else if (data.data.simready === true) {
        console.log('(main) message received: simready');
        this.status = 'idle';
        this.simulationFinished.next(true);
      } else if (data.data.fileready === true) {
        if (data.data.filename.endsWith('.vtp')) {
          console.log(
              '(main) message received: fileready, file=' + data.data.filename);
          let filenameonly = data.data.filename.replace(/^.*[\\\/]/, '');
          this.results.push(new Result(
              data.data.filecontent, filenameonly, true,
              vtkActor.newInstance()));
          this.resultReady.next(this.results.length-1);
          console.log(this.results.length-1)
          this.sendNewResult(this.results.length-1);
          // console.log(this.results);
        }
        if (data.data.filename.endsWith('.vtu')) {
          console.log('(main) message received: fileready, file=' + data.data.filename);
          console.log('.vtu file format not supported');
          // console.log(this.results);
        }        
      } else if (data.data.stdout === true || data.data.stderr === true) {
        console.log(
            '(main) message received: stdout/stderr, text=' + data.data.text);
        // this.stdoutReady.next(data.data.text);
        // console.log(data.data);
        this.sendConsoleLine(data.data.text);
      } else if (data.data.runtimeexception === true) {
        console.log('(main) webworker reported a runtime exception in C++');
        this.status = 'exception';
        this.exceptionInCPP.next(true);
        // this.respawnSimulation();
      } else {
        console.log('(main) unknown message from worker');
      }
    }.bind(this);
  }


  private newconsoleline = new Subject<any>();

  sendConsoleLine(line: string) {
    this.newconsoleline.next({text: line});
  }

  // clearMessage() {
  //     this.newconsoleline.next();
  // }

  getConsoleLine(): Observable<any> {
    return this.newconsoleline.asObservable();
  }

  private newresult = new Subject<any>();

  sendNewResult(idx: number) {
    // console.log("###################### sendNewResult " + idx);
    this.newresult.next({index: idx});
  }

  getNewResults(): Observable<any> {
    return this.newresult.asObservable();
  }


}
