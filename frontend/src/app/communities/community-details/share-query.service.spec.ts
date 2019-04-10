import { TestBed } from '@angular/core/testing';

import { ShareQueryService } from './share-query.service';

describe('ShareQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareQueryService = TestBed.get(ShareQueryService);
    expect(service).toBeTruthy();
  });
});
