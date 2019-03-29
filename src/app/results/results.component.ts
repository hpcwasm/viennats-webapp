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
  conesource: any;
  mapper: any;
  actor: any;
  renderbounds: any = [0, 30, 0, 50, 7, 30];
  redcolor: Color;

  // props: any;
  subscription: Subscription;
  subscriptionResulstCleared: Subscription;

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
          this.renderResult(message.index);
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

  // listen on event of new result ready
  renderResult(index: number) {
    if (index > 0) {
      if (this.webworkerService.results[index].selected == true) {
        this.changeVisibility(index - 1);
      }
    }
    const encoder = new TextEncoder();
    const buffer = encoder.encode(this.webworkerService.results[index].vtkfile);
    var vtpReader = vtkXMLPolyDataReader.newInstance();
    vtpReader.parseAsArrayBuffer(buffer);
    var polydata = vtpReader.getOutputData(0);


    var mapper =
        vtkMapper.newInstance({scalarVisibility: true, scalarRange: [0, 10]});
    // var actor = vtkActor.newInstance();

    if (this.webworkerService.results[index].filename.includes('Hull')) {
      if (true) {
        var bounds = polydata.getBounds();
        console.log('########## bounds ');
        console.log(bounds);
        var normal = [0, 1, 0];
        var center = [
          (bounds[1] - bounds[0]) / 2.0, (bounds[3] - bounds[2]) / 2.0,
          (bounds[5] - bounds[4]) / 2.0
        ];
        console.log('########## center ');
        console.log(center);
        var plane = vtkPlane.newInstance({origin: center, normal: normal});
        var sphere = vtkSphere.newInstance({center: center, radius: 100});
        var cutter = vtkCutter.newInstance();
        cutter.setCutFunction(plane);

        cutter.setInputConnection(vtpReader.getOutputPort());
        mapper.setInputConnection(cutter.getOutputPort());
        mapper.setScalarModeToUseCellData();
        // console.log("########## polydata.getCellData()");
        // console.log(polydata.getCellData().getScalars().getNumberOfValues());
        // console.log(polydata.getCellData().getScalars().getData());
      } else {
        mapper.setScalarModeToUseCellData();
        mapper.setInputData(polydata);
      }
    } else if (this.webworkerService.results[index].filename.includes(
                   'Interface')) {
      mapper.setInputData(polydata);

    } else {
      throw '############ unknown geometry extension'
    }


    this.webworkerService.results[index].actor.setMapper(mapper);
    // this.webworkerService.results[index].actor.getProperty().setColor(1, 0,
    // 0);
    this.webworkerService.results[index].actor.getProperty().setColor(
        this.redcolor.R, this.redcolor.G, this.redcolor.B);

    this.renderer.addActor(this.webworkerService.results[index].actor);
    if (index == 0) {
      this.renderer.resetCamera();
    }
    this.renderWindow.render();
    let props = this.renderer.getViewProps();
    if (props.length !== this.webworkerService.results.length) {
      console.error('length of results and viewer actors doesnt match!');
      console.log(props.length);
      console.log(this.webworkerService.results.length);
    }
  }

  selectall() {
    let props = this.renderer.getViewProps();
    let idx = 0;
    for (let file of this.webworkerService.results) {
      file.selected = true;
      props[idx].setVisibility(true);
      idx = idx + 1;
    }
    this.renderWindow.render();
    this.renderer.resetCamera();
  }

  deselectall() {
    let props = this.renderer.getViewProps();
    let idx = 0;
    for (let file of this.webworkerService.results) {
      file.selected = false;
      props[idx].setVisibility(false);
      idx = idx + 1;
    }
    this.renderWindow.render();
    // this.renderer.resetCamera();
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

  changeVisibility(idx: number) {
    let props = this.renderer.getViewProps();
    // console.log('changeVisibility ' + idx);
    console.log(this.webworkerService.results[idx].selected);
    if (this.webworkerService.results[idx].selected == true) {
      // console.log('turnon ' + idx);
      this.webworkerService.results[idx].selected = false;
      props[idx].setVisibility(false);
    } else if (this.webworkerService.results[idx].selected == false) {
      // console.log('turnoff ' + idx);
      this.webworkerService.results[idx].selected = true;
      props[idx].setVisibility(true);
    }
    this.renderWindow.render();
    // this.renderer.resetCamera();
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
