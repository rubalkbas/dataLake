import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAsuntoPeticionarioComponent } from './consultaAsuntoPeticionario.component';

describe('ConsultaAsuntoPeticionarioComponent', () => {
  let component: ConsultaAsuntoPeticionarioComponent;
  let fixture: ComponentFixture<ConsultaAsuntoPeticionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAsuntoPeticionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaAsuntoPeticionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
