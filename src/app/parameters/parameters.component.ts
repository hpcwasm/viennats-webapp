import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit,OnDestroy} from '@angular/core';
import { WebworkerService } from '../services/webworker/webworker.service';

import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.sass']
})
export class ParametersComponent implements OnInit, OnDestroy {
  // editorcontent: String = '//empty parameter file';
  editoroptions = {lineNumbers: true, theme: 'xq-light', mode: 'javascript'};

  parentRouteId: string;
  private sub: any;
  selectedTabIndex: number = 1;

  constructor(private http: HttpClient, public webworkerService: WebworkerService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.sub = this.route.params.subscribe((params => {
      this.parentRouteId = params['simpath'];
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  reloadContent() {
    this.loadsim(this.webworkerService.selectedSimIdx);
  }

  loadsim(simidx: number) {
    this.webworkerService.loadsim(simidx);
    this.selectedTabIndex = 1;
  }
}
