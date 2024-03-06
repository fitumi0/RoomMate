import { TestBed } from '@angular/core/testing';

import { MatchValidationService } from './match-validation.service';

describe('MatchValidationService', () => {
  let service: MatchValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
