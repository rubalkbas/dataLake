import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAsuntoComponent } from './consulta-asunto.component';

describe('ConsultaAsuntoComponent', () => {
  let component: ConsultaAsuntoComponent;
  let fixture: ComponentFixture<ConsultaAsuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAsuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaAsuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
