import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import { WebworkerService } from '../services/webworker/webworker.service';


@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.sass']
})
export class ParametersComponent implements OnInit {
  // editorcontent: String = '//empty parameter file';
  editoroptions = {lineNumbers: true, theme: 'xq-light', mode: 'javascript'};


  selectedTabIndex: number = 1;

  constructor(private http: HttpClient, public webworkerService: WebworkerService) {}

  ngOnInit() {}

  reloadContent() {
    this.loadsim(this.webworkerService.selectedSimIdx);
  }

  loadsim(simidx: number) {
    this.webworkerService.loadsim(simidx);
    this.selectedTabIndex = 1;
  }
}
