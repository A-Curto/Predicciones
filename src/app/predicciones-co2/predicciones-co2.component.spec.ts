import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrediccionesCo2Component } from './predicciones-co2.component';

describe('PrediccionesCo2Component', () => {
  let component: PrediccionesCo2Component;
  let fixture: ComponentFixture<PrediccionesCo2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrediccionesCo2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrediccionesCo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
