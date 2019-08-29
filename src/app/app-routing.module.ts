import {NgModule} from '@angular/core';
import {CanActivate, RouterModule, Routes} from '@angular/router';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

// import {CustomReuseStrategy} from './app-routing-reuse';
import {BrowserinfoComponent} from './browserinfo/browserinfo.component';
import {ReferencesComponent} from './references/references.component';
import {ConsoleComponent} from './console/console.component';
import {HomeComponent} from './home/home.component';
import {ParametersComponent} from './parameters/parameters.component';
import {ResultsComponent} from './results/results.component';
import {NosupportService} from './services/routeguard/nosupport.service';
import {SimulationComponent} from './simulation/simulation.component';
import { UseroptionsComponent } from './useroptions/useroptions.component';
import {SimulationstatusComponent} from './simulationstatus/simulationstatus.component';

// export const routesToCache: string[] = ['simulation'];

export const routes: Routes = [
  {path: 'browserinfo', component: BrowserinfoComponent},
  {path: 'references', component: ReferencesComponent,  canActivate: [NosupportService]},
  {path: 'useroptions', component: UseroptionsComponent,  canActivate: [NosupportService]},
  {
    path: 'simulation/:simpath',
    component: SimulationComponent,
    data: {shouldReuse: true},
    canActivate: [NosupportService],
    children: [
      {path: '', component: ParametersComponent, data: {shouldReuse: true}},
      {path: '', component: ResultsComponent, data: {shouldReuse: true}},
      {
        path: '',
        component: SimulationstatusComponent,
        data: {shouldReuse: true}
      },
    ]

  },
  {path: 'home', component: HomeComponent, canActivate: [NosupportService]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'},

];
// https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular
// https://stackoverflow.com/questions/44875644/custom-routereusestrategy-for-angulars-child-module
export class CustomReuseStrategy implements RouteReuseStrategy {
  handlers: {[key: string]: DetachedRouteHandle} = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log("## shouldDetach "+(route.data.shouldReuse || false));
    return route.data.shouldReuse || false;
  }

  store(route: ActivatedRouteSnapshot, handle: {}): void {
    console.log("## store ");
    if (route.data.shouldReuse && this.getUrl(route)) {
      console.log("## storeing "+ handle);
      this.handlers[this.getUrl(route)] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log("## shouldAttach "+!!this.handlers[this.getUrl(route)]);
    return !!this.handlers[this.getUrl(route)];
  }

  retrieve(route: ActivatedRouteSnapshot): any {
    console.log("## retrieve "+this.handlers[this.getUrl(route)]);
    if (!this.getUrl(route)) {
      return null;
    }
    return this.handlers[this.getUrl(route)];
  }

  shouldReuseRoute(
      future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig &&
        JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  getUrl(route: ActivatedRouteSnapshot) {
    console.log("getUrl");
    if (!route.parent.url.join('/') && !route.url.join('/')) {
      return null;
    }
    let url = '';
    if (route.parent.url.join('/')) {
      url += route.parent.url.join('/') + '/';
    }
    if (route.url.join('/')) {
      url += route.url.join('/');
    }
    console.log(url);
    return url === '' ? null : url;
  }
}

// //
// https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular/47877958
// export class CustomReuseStrategy implements RouteReuseStrategy {
//   routesToCache: string[] = ['simulation', 'simulation/cylinderemulate'];
//   storedRouteHandles = new Map<string, DetachedRouteHandle>();

//   // Decides if the route should be stored
//   shouldDetach(route: ActivatedRouteSnapshot): boolean {
//     console.log(this.routesToCache);

//     return this.routesToCache.indexOf(route.routeConfig.path) > -1;
//   }

//   // Store the information for the route we're destructing
//   store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
//     this.storedRouteHandles.set(route.routeConfig.path, handle);
//   }

//   // Return true if we have a stored route object for the next route
//   shouldAttach(route: ActivatedRouteSnapshot): boolean {
//     return this.storedRouteHandles.has(route.routeConfig.path);
//   }

//   // If we returned true in shouldAttach(), now return the actual route data
//   for
//   // restoration
//   retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
//     return this.storedRouteHandles.get(route.routeConfig.path);
//   }

//   // Reuse the route if we're going to and from the same route
//   shouldReuseRoute(
//       future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean
//       {
//     return future.routeConfig === curr.routeConfig;
//   }
// }

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [{provide: RouteReuseStrategy, useClass: CustomReuseStrategy}],
})
export class AppRoutingModule {
}
