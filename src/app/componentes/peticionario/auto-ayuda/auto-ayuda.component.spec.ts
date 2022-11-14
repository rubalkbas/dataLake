import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAyudaComponent } from './auto-ayuda.component';

describe('AutoAyudaComponent', () => {
  let component: AutoAyudaComponent;
  let fixture: ComponentFixture<AutoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
