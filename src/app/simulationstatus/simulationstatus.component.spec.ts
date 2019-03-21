import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationstatusComponent } from './simulationstatus.component';

describe('SimulationstatusComponent', () => {
  let component: SimulationstatusComponent;
  let fixture: ComponentFixture<SimulationstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
