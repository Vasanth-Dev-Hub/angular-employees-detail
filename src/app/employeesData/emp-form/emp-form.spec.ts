import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpForm } from './emp-form';

describe('EmpForm', () => {
  let component: EmpForm;
  let fixture: ComponentFixture<EmpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
