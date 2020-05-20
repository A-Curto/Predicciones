import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPrediccionComponent } from './crear-prediccion.component';

describe('CrearPrediccionComponent', () => {
  let component: CrearPrediccionComponent;
  let fixture: ComponentFixture<CrearPrediccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPrediccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPrediccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
