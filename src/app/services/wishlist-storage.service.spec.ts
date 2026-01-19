import { TestBed } from '@angular/core/testing';

import { WishlistStorageService } from './wishlist-storage.service';

describe('WishlistStorageService', () => {
  let service: WishlistStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
