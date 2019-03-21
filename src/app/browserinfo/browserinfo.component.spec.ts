import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserinfoComponent } from './browserinfo.component';

describe('BrowserinfoComponent', () => {
  let component: BrowserinfoComponent;
  let fixture: ComponentFixture<BrowserinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
