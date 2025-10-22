import { TestBed } from '@angular/core/testing';

import { TypeTransferService } from './type-transfer.service';

describe('TypeTransferService', () => {
  let service: TypeTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
