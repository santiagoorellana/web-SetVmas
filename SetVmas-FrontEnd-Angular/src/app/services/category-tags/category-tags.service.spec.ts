import { TestBed } from '@angular/core/testing';

import { CategoryTagsService } from './category-tags.service';

describe('CategoryTagsService', () => {
  let service: CategoryTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
