import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelsimComponent } from './cancelsim.component';

describe('CancelsimComponent', () => {
  let component: CancelsimComponent;
  let fixture: ComponentFixture<CancelsimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelsimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelsimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
