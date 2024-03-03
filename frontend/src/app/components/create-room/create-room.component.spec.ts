import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomComponent } from './create-room.component';

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let fixture: ComponentFixture<CreateRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
