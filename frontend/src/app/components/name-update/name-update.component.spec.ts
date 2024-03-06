import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameUpdateComponent } from './name-update.component';

describe('NameUpdateComponent', () => {
  let component: NameUpdateComponent;
  let fixture: ComponentFixture<NameUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NameUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
