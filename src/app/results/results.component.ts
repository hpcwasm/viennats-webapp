import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileSaverService} from 'ngx-filesaver';
import {encode} from 'punycode';
import {Subscription} from 'rxjs';
import {FieldDataTypes} from 'vtk.js/Sources/Common/DataModel/DataSet/Constants';
import {AttributeTypes} from 'vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants';
import vtkPlane from 'vtk.js/Sources/Common/DataModel/Plane';
import vtkSphere from 'vtk.js/Sources/Common/DataModel/Sphere';
import vtkCutter from 'vtk.js/Sources/Filters/Core/Cutter';
import vtkCalculator from 'vtk.js/Sources/Filters/General/Calculator';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
// https://stackoverflow.com/questions/48643556/use-vtk-js-glsl-files-in-angular-cli-app

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';

import {WebworkerService} from '../services/webworker/webworker.service';

// class File {
//   constructor(public filepath: string, public selected: boolean){}
// }
class Color {
  constructor(public R: number, public G: number, public B: number) {}
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent implements OnInit, OnDestroy {
  // files: File[] = [];

  @ViewChild('vtkview') vtkview: any;
  fullScreenRenderer: any;
  renderer: any;
  renderWindow: any;
  redcolor: Color;

  // props: any;
  subscription: Subscription;
  subscriptionResulstCleared: Subscription;

  // clipping
  activeClipDir: string = 'x';
  clipdirs: string[] = ['x', 'y'];
  activeClipValue: any = 101;
  centerOff: any = [0, 0, 0];

  updateClip(){
    this.displayOutput(this.activeResultsIndex);
  }

  makeCutPlane(clipdir: string, clipValue: number, bounds: number[]) {
    var domsize = [
      (bounds[1] - bounds[0]), (bounds[3] - bounds[2]), (bounds[5] - bounds[4])
    ];
    console.log('########## domsize ');
    console.log(domsize);
    if (clipdir == 'x') {
      var clipvalnorm = clipValue / 100.0;
      var normal = [0, 1, 0];
      var center = [bounds[1], bounds[3] - domsize[1] * clipvalnorm, bounds[5]];
    }
    if (clipdir == 'y') {
      var clipvalnorm = clipValue / 100.0;
      var normal = [1, 0, 0];
      var center = [bounds[1] - domsize[0] * clipvalnorm, bounds[3], bounds[5]];      

    }
    console.log(normal);
    console.log(center);
    console.log(clipValue);
    console.log(clipvalnorm);
    return {origin: center, normal: normal};
  }


  // results player
  has3Dresults: boolean = false;
  playing: boolean = true;
  activeResultsIndex = undefined;
  togglePlay() {
    if (this.activeResultsIndex != undefined) {
      if (!this.playing) {
        this.activeResultsIndex = this.webworkerService.results.length - 1;
        this.playing = true;
        this.displayOutput(this.activeResultsIndex);
      } else {
        this.playing = false;
      }
    }
  }
  showPrev() {
    if (this.activeResultsIndex != undefined) {
      this.activeResultsIndex =
          this.activeResultsIndex > 0 ? this.activeResultsIndex - 1 : 0;
      this.playing = false;
      this.displayOutput(this.activeResultsIndex);
      this.renderWindow.render();
    }
  }
  showNext() {
    if (this.activeResultsIndex != undefined) {
      this.activeResultsIndex =
          this.webworkerService.results.length - 1 > this.activeResultsIndex ?
          this.activeResultsIndex + 1 :
          this.webworkerService.results.length - 1;
      this.playing = false;
      this.displayOutput(this.activeResultsIndex);
      this.renderWindow.render();
    }
  }

  formatLabel(value: number) {
    return (value / 100.0);
  }

  constructor(
      public webworkerService: WebworkerService,
      private fileSaverService: FileSaverService) {
    // this.files.push(new File("Filenam1", false));
    // this.files.push(new File("Filenam2", false ));
    // this.files.push(new File("Filenam3", true));
    // this.files.push(new File("Filenam4", false));
    // this.tucolor = new Color(0,102,153);
    this.redcolor = new Color(255 / 255, 0, 0);
    this.subscription =
        this.webworkerService.getNewResults().subscribe(message => {
          // this.renderResult(message.index);
          this.renderResultPlayer(message.index);
        });
    this.subscriptionResulstCleared =
        this.webworkerService.getResulstCleared().subscribe(message => {
          this.clearRenderWindow();
        });
  }

  clearRenderWindow() {
    this.renderer.removeAllViewProps();
    // this.props = this.renderer.getViewProps();
    this.renderWindow.render();
    this.renderer.resetCamera();
    this.has3Dresults = false;
    this.playing = true;
    this.activeResultsIndex = undefined;
  }

  initRenderWindow() {
    // console.log(this.vtkview);
    let background = [1, 1, 1];
    this.fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background,
      rootContainer: this.vtkview.nativeElement,
      containerStyle: {height: '100%', width: '100%', position: 'relative'},
    });
    this.renderer = this.fullScreenRenderer.getRenderer();
    this.renderWindow = this.fullScreenRenderer.getRenderWindow();
    // this.props = this.renderer.getViewProps();
  }

  ngOnInit() {
    this.initRenderWindow();

    // this.conesource = vtkConeSource.newInstance({ height: 1.0 })
    // this.mapper = vtkMapper.newInstance();
    // this.mapper.setInputConnection(this.conesource.getOutputPort());

    // this.actor = vtkActor.newInstance();
    // this.actor.setMapper(this.mapper);
    // this.actor.getProperty().setColor(1,0,0);
    // this.renderer.addActor(this.actor);
    // this.renderer.resetCamera();
    // this.renderWindow.render();
    // let props = this.renderer.getViewProps();
    // console.log(props);
  }


  renderResultPlayer(index: number) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(this.webworkerService.results[index].vtkfile);
    var vtpReader = vtkXMLPolyDataReader.newInstance();
    vtpReader.parseAsArrayBuffer(buffer);
    var polydata = vtpReader.getOutputData(0);
    var mapper =
        vtkMapper.newInstance({scalarVisibility: true, scalarRange: [0, 13]});

    console.log('########## bounds ');
    var bounds = polydata.getBounds();
    this.webworkerService.results[index].bounds = bounds;
    console.log(bounds);
    var normal = [0, 1, 0];

    console.log('########## center ');
    var center = [
      (bounds[1] - bounds[0]) / 2.0, (bounds[3] - bounds[2]) / 2.0,
      (bounds[5] - bounds[4]) / 2.0
    ];
    console.log(center);
    const maxb = Math.max(...center);
    const minb = Math.min(...center);

    if (Math.abs(maxb / minb) < 1000) {  // 3D results
      this.has3Dresults = true;
      var cuttingplane = [
        center[0] + this.centerOff[0], center[1] + this.centerOff[1],
        center[2] + this.centerOff[2]
      ];

      var tmp =
          this.makeCutPlane(this.activeClipDir, this.activeClipValue, bounds);
      this.webworkerService.results[index].cliporg = tmp.origin;
      this.webworkerService.results[index].clipnorm = tmp.normal;
      var plane =
          vtkPlane.newInstance({origin: tmp.origin, normal: tmp.normal});
      this.webworkerService.results[index].clipplane = plane;          
      console.log('########## cutplane ');
      console.log(plane);
      console.log(this.webworkerService.results[index].cliporg);
      console.log(this.webworkerService.results[index].clipnorm);

      this.webworkerService.results[index].cutter.setCutFunction(plane);
      this.webworkerService.results[index].cutter.setInputConnection(
          vtpReader.getOutputPort());
      mapper.setInputConnection(
          this.webworkerService.results[index].cutter.getOutputPort());
      mapper.setScalarModeToUseCellData();
    } else {  // 2D results
      this.has3Dresults = false;
      mapper.setScalarModeToUseCellData();
      mapper.setInputData(polydata);
    }


    this.webworkerService.results[index].actor.setMapper(mapper);
    this.renderer.addActor(this.webworkerService.results[index].actor);

    if (index == 0) {
      this.renderer.resetCamera();
    }

    let props = this.renderer.getViewProps();
    props[index].setVisibility(false);
    if (this.playing || this.activeResultsIndex == undefined) {
      this.playing = true;
      this.activeResultsIndex = this.webworkerService.results.length - 1;
      // make new results visible
      this.displayOutput(this.activeResultsIndex);
      console.log('########## this.playing || this.activeResultsIndex == undefined ');
    } else {
      // nothing to update
    }
  }

  resetCamera() {
    this.renderer.resetCamera();
    this.renderWindow.render();
    this.renderer.resetCamera();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.subscriptionResulstCleared.unsubscribe();
  }

  displayOutput(idx: number) {
    let props = this.renderer.getViewProps();

    let i = 0;
    for (let file of this.webworkerService.results) {
      props[i].setVisibility(false);
      i = i + 1;
    }
    props[idx].setVisibility(true);

    if (this.has3Dresults) {
      // change cutting if it has changed
      var activeclip = this.makeCutPlane(
          this.activeClipDir, this.activeClipValue,
          this.webworkerService.results[idx].bounds);
      for (var k = 0; k != 3; ++k) {
        if (this.webworkerService.results[idx].cliporg[k] !=
                activeclip.origin[k] ||
            this.webworkerService.results[idx].clipnorm[k] !=
                activeclip.normal[k]) {
          // set new vtkplane
          this.webworkerService.results[idx].cliporg = activeclip.origin;
          this.webworkerService.results[idx].clipnorm = activeclip.normal;
          this.webworkerService.results[idx].clipplane.setOrigin(activeclip.origin);
          this.webworkerService.results[idx].clipplane.setNormal(activeclip.normal);
          console.log('########## new cutplane ');
          // console.log(plane);
          this.renderWindow.render();
          return;
        }
      }
    }

    this.renderWindow.render();

    // TODO HERE

    // console.log(
    //     '########################
    //     this.webworkerService.results[idx].cutter');
    // console.log(this.webworkerService.results[idx].cutter);
  }

  downloadResult(idx: number) {
    console.log(
        '############ download: ' +
        this.webworkerService.results[idx].filename);
    var blob = new Blob(
        [this.webworkerService.results[idx].vtkfile], {type: 'text/plain'});
    this.fileSaverService.save(
        blob, this.webworkerService.results[idx].filename);
  }
}
