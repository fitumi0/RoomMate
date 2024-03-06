import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordUpdateComponent } from './password-update.component';

describe('PasswordUpdateComponent', () => {
  let component: PasswordUpdateComponent;
  let fixture: ComponentFixture<PasswordUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
