import { TestBed } from '@angular/core/testing';

import { Consumo } from './consumo';

describe('Consumo', () => {
  let service: Consumo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Consumo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
