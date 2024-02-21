import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatsComponent } from './formats.component';

describe('FormatsComponent', () => {
  let component: FormatsComponent;
  let fixture: ComponentFixture<FormatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
