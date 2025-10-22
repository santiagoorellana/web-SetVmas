import { TestBed } from '@angular/core/testing';

import { SearchAdService } from './search-ad.service';

describe('SearchAdService', () => {
  let service: SearchAdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchAdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
