import { TestBed } from '@angular/core/testing';

import { CartQuantitiesStorageService } from './cart-quantities-storage.service';

describe('CartQuantitiesStorageService', () => {
  let service: CartQuantitiesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartQuantitiesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
