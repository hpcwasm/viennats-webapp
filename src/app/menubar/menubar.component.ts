import { Component, OnInit } from '@angular/core';
import { Router,Routes,ActivatedRoute } from '@angular/router';
import {routes} from '../app-routing.module';
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.sass']
})
export class MenubarComponent implements OnInit {

  // routes: Routes = routes;

  constructor(public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
  }

}
