import {NgModule} from '@angular/core';
import {CanActivate, RouterModule, Routes} from '@angular/router';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

// import {CustomReuseStrategy} from './app-routing-reuse';
import {BrowserinfoComponent} from './browserinfo/browserinfo.component';
import {ConsoleComponent} from './console/console.component';
import {HomeComponent} from './home/home.component';
import {NosupportService} from './services/routeguard/nosupport.service';
import {SimulationComponent} from './simulation/simulation.component';


export const routes: Routes = [
  {path: 'browserinfo', component: BrowserinfoComponent},
  {
    path: 'simulation',
    component: SimulationComponent,
    canActivate: [NosupportService]
  },
  {path: 'home', component: HomeComponent, canActivate: [NosupportService]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'},

];

// https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular/47877958
export class CustomReuseStrategy implements RouteReuseStrategy {
  routesToCache: string[] = ['simulation'];
  storedRouteHandles = new Map<string, DetachedRouteHandle>();

  // Decides if the route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.routesToCache.indexOf(route.routeConfig.path) > -1;
  }

  // Store the information for the route we're destructing
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRouteHandles.set(route.routeConfig.path, handle);
  }

  // Return true if we have a stored route object for the next route
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRouteHandles.has(route.routeConfig.path);
  }

  // If we returned true in shouldAttach(), now return the actual route data for
  // restoration
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRouteHandles.get(route.routeConfig.path);
  }

  // Reuse the route if we're going to and from the same route
  shouldReuseRoute(
      future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [{provide: RouteReuseStrategy, useClass: CustomReuseStrategy}],
})
export class AppRoutingModule {
}
