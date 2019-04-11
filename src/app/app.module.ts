import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material';
import {MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {DeviceDetectorModule} from 'ngx-device-detector';

import { MatDialogModule ,MatBadgeModule} from '@angular/material';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserinfoComponent} from './browserinfo/browserinfo.component';
import {CodemirrorComponent} from './codemirror/codemirror.component';
import {ConsoleComponent} from './console/console.component';
import {HomeComponent} from './home/home.component';
import {MenubarComponent} from './menubar/menubar.component';
import {ParametersComponent} from './parameters/parameters.component';
import {ResultsComponent} from './results/results.component';
import {SimulationComponent} from './simulation/simulation.component';
import {SimulationstatusComponent} from './simulationstatus/simulationstatus.component';
import { CancelsimComponent } from './cancelsim/cancelsim.component';
import { NosupportComponent } from './nosupport/nosupport.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';

import { FileSaverModule } from 'ngx-filesaver';
import { Cancelsim2Component } from './cancelsim2/cancelsim2.component';


// import {RouteReuseStrategy} from '@angular/router';

// import {CustomReuseStrategy} from './app-routing-reuse';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    CodemirrorComponent,
    MenubarComponent,
    HomeComponent,
    SimulationComponent,
    BrowserinfoComponent,
    ParametersComponent,
    SimulationstatusComponent,
    ResultsComponent,
    CancelsimComponent,
    NosupportComponent,
    Cancelsim2Component
  ],
  imports: [
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    MatIconModule, MatToolbarModule, MatInputModule, MatFormFieldModule, MatBadgeModule, 
    MatExpansionModule, BrowserModule, AppRoutingModule, MatMenuModule,
    MatButtonModule, MatTooltipModule, MatSliderModule, MatSnackBarModule, MatCardModule, MatDialogModule,
    MatListModule, MatPaginatorModule, MatRadioModule, MatProgressSpinnerModule, MatSortModule,
    MatGridListModule, MatCheckboxModule, MatTabsModule, MatSelectModule,
    MatDividerModule, MatTableModule, MatProgressBarModule, FormsModule,
    HttpClientModule, CodemirrorModule, DeviceDetectorModule.forRoot(),
   FlexLayoutModule, FileSaverModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [CancelsimComponent,Cancelsim2Component]
})
export class AppModule {
}
