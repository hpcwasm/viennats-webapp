import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cancelsim2Component } from './cancelsim2.component';

describe('Cancelsim2Component', () => {
  let component: Cancelsim2Component;
  let fixture: ComponentFixture<Cancelsim2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cancelsim2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cancelsim2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
