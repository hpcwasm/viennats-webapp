import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlSegment, UrlSegmentGroup} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {ResultsComponent} from 'src/app/results/results.component';
import vtkPlane from 'vtk.js/Sources/Common/DataModel/Plane';
import vtkCutter from 'vtk.js/Sources/Filters/Core/Cutter';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import {ColorMode, ScalarMode,} from 'vtk.js/Sources/Rendering/Core/Mapper/Constants';

import {DeviceinfoService} from '../deviceinfo/deviceinfo.service';

export interface ParFile {
  prefixpath: string;
  parfile: string;
  geometries: string[];
  title: string;
  image: string;
  description: string;
  geoready: boolean;
}
class ParFileClass implements ParFile {
  constructor(
      public prefixpath: string, public parfile: string,
      public geometries: string[], public title: string, public image: string,
      public description: string, public geoready: boolean) {}
}

export class Result {
  constructor(
      public vtkfile: string, public filename: string, public cutter: vtkCutter,
      public actor: vtkActor, public bounds: number[], public cliporg: number[],
      public clipnorm: number[], public clipplane: vtkPlane) {}
}

export class Error {
  constructor(public vtkfile: string, public filename: string) {}
}

@Injectable({providedIn: 'root'})
export class WebworkerService {
  parfiles: ParFile[] = [];

  //  selectedParfile: string = undefined;
  // selectedParfile: string;
  selectedSimIdx: number;

  getParfilePath(idx: number) {
    return './assets/simulations/' + this.parfiles[idx].prefixpath + '/' +
        this.parfiles[idx].parfile;
  }
  getBEPrefix(idx: number) {
    return './assets/simulations/' + this.parfiles[idx].prefixpath + '/';
  }
  getFSPrefix(idx: number) {
    return '/simulations/' + this.parfiles[idx].prefixpath + '/';
  }
  getImageFilePath(idx: number) {
    return './assets/simulations/' + this.parfiles[idx].prefixpath + '/' +
        this.parfiles[idx].image;
  }

  results: Result[] = [];
  errors: Error[] = [];

  simulationWorkerFilePath: string = './assets/js/vtsworker.js';
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

  parfilesReady: EventEmitter<any> = new EventEmitter();
  simulationFinished: EventEmitter<any> = new EventEmitter();
  simulationStarted: EventEmitter<any> = new EventEmitter();
  exceptionInCPP: EventEmitter<any> = new EventEmitter();
  initializationStarted: EventEmitter<any> = new EventEmitter();
  runtimeReady: EventEmitter<any> = new EventEmitter();
  resultReady: EventEmitter<any> = new EventEmitter();
  // stdoutReady: EventEmitter<any> = new EventEmitter();

  private routerevent: any;

  constructor(
      private http: HttpClient, public deviceinfo: DeviceinfoService,
      private router: Router) {
    this.getSimulations().subscribe(data => {
      console.log('received simulation_examples.json');
      // console.log(data);
      for (let example of data.simulations) {
        if (this.deviceinfo.deviceLevel >= example.devicelevel) {
          this.parfiles.push(new ParFileClass(
              example.prefixpath, example.parfile, example.geometries,
              example.title, example.image, example.description, false));
        }
      }
      this.selectedSimIdx = 0;
      this.loadsim(this.selectedSimIdx);
      this.sendParfilesReady();

      this.initializeSimulation();
    });

    this.routeEvent(this.router);
  }

  updatefromRoute(simpath: string) {
    if (this.parfiles.length > 0) {
      const currentpath = this.parfiles[this.selectedSimIdx].prefixpath;
      // find new index
      let newidx = undefined;
      for (let idx = 0; idx != this.parfiles.length; ++idx) {
        if (this.parfiles[idx].prefixpath.toLowerCase() == simpath) {
          newidx = idx;
          break;
        }
      }
      console.log('newidx=' + newidx);
      // only if valid url
      if (newidx != undefined) {
        // check if simpath is valid
        // check if simpath differs to current state -> no action
        if (newidx == this.selectedSimIdx) {
          console.log('newidx == this.selectedSimIdx, do nothing');
          // do nothing
        } else {
          console.log('newidx != this.selectedSimIdx');
          // check if running other sim
          if (this.status == 'running' || this.status == 'exception') {
            // respawn
            console.log('respawn');
            this.respawnSimulation();
          }
          // cleanup
          console.log('cleanup');
          this.clearResults();
          this.sendClearConsoleLog();
          this.loadsim(newidx);
        }
      }
    }
  }

  routeEvent(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        console.log('#################router navigation end');
        var myRegexp = /\/simulation\/(.*)/;
        var arr = this.router.url.match(/\/simulation\/(.*)/);
        if (arr != null) {  // Did it match?
          console.log('trigger update');
          console.log(arr[1]);
          const simpath = arr[1].toLowerCase();
          this.updatefromRoute(simpath);
        }
      }
    });
  }

  clearResults() {
    // this.results.length = 0;
    while (this.results.length > 0) {
      this.results.pop();
    }
    while (this.errors.length > 0) {
      this.errors.pop();
    }
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

  loadsim(simidx: number) {
    this.selectedSimIdx = simidx;
    const filename = this.getParfilePath(simidx);
    this.http.get(filename, {responseType: 'text'})
        .subscribe(
            data => {
              // console.log(data);
              this.parfilecontent = data;
            },
            error => {
              console.log('error loading parameter file ' + filename);
              this.parfilecontent =
                  '// error loading parameter file ' + filename;
            });
  }

  public getSimulations(): Observable<any> {
    return this.http.get('./assets/simulations/simulation_examples.json');
  }

  startSimulation() {
    this.clearResults();

    // transfer data
    // wait until transfered

    var runsimdata: any = {
      'parfilestring': this.parfilecontent,
      'parfile': this.parfiles[this.selectedSimIdx].parfile,
      'FSfolder': this.parfiles[this.selectedSimIdx].prefixpath,
      'geomtries': this.parfiles[this.selectedSimIdx].geometries,
    };
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
        if (data.data.filename.endsWith('.vtp') &&
            data.data.filename.includes('Hull')) {
          console.log(
              '(main) message received: fileready, file=' + data.data.filename);
          let filenameonly = data.data.filename.replace(/^.*[\\\/]/, '');
          console.log('filenameonly:' + filenameonly);
          this.results.push(new Result(
              data.data.filecontent, filenameonly, vtkCutter.newInstance(),
              vtkActor.newInstance(), undefined, undefined, undefined,
              vtkPlane.newInstance()));
          this.resultReady.next(this.results.length - 1);
          console.log(this.results.length - 1);
          this.sendNewResult(this.results.length - 1);
          // console.log(this.results);
        }
        if (data.data.filename.endsWith('.vtp') &&
            data.data.filename.includes('Error')) {
          console.log(
              '(main) message received: errorfileready, file=' +
              data.data.filename);
          let filenameonly = data.data.filename.replace(/^.*[\\\/]/, '');
          console.log('filenameonly:' + filenameonly);
          this.errors.push(new Error(data.data.filecontent, filenameonly));
          console.log(this.results.length - 1);
          this.sendNewError(this.errors.length - 1);
          // console.log(this.results);
        }
        if (data.data.filename.endsWith('.vtu')) {
          console.log(
              '(main) message received: fileready, file=' + data.data.filename);
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

  private newerror = new Subject<any>();

  sendNewError(idx: number) {
    this.newerror.next({index: idx});
  }

  getNewErrors(): Observable<any> {
    return this.newerror.asObservable();
  }


  // parfiles ready
  private parfilesready = new Subject<any>();

  sendParfilesReady() {
    this.parfilesready.next();
  }

  getParfilesReady(): Observable<any> {
    return this.parfilesready.asObservable();
  }
}
