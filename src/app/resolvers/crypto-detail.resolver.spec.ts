import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { KlineDataArray } from '../models/share.model';
import { CryptoService } from '../services/crypto.service';
import { CryptoDetailResolver } from './crypto-detail.resolver';

describe('CryptoDetailResolver', () => {
  let resolver: CryptoDetailResolver;
  let cryptoService: jasmine.SpyObj<CryptoService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  const mockKlineData: KlineDataArray = [
    [
      1650067200000,
      '0.01028900',
      '0.01033600',
      '0.01024800',
      '0.01033000',
      '45376.24600000',
      1650153599999,
      '466.84867441',
      34131,
      '21870.64000000',
      '225.01931250',
      '0',
    ],
  ];

  beforeEach(() => {
    const cryptoSpy = jasmine.createSpyObj('CryptoService', ['getKlineData']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        CryptoDetailResolver,
        { provide: CryptoService, useValue: cryptoSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    resolver = TestBed.inject(CryptoDetailResolver);
    cryptoService = TestBed.inject(
      CryptoService
    ) as jasmine.SpyObj<CryptoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    route = Object.create(ActivatedRouteSnapshot.prototype, {
      paramMap: {
        get: () => ({
          get: (key: string) => 'BTCUSDT',
        }),
      },
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve kline data successfully', (done) => {
    cryptoService.getKlineData.and.returnValue(of(mockKlineData));

    resolver.resolve(route).subscribe((data) => {
      expect(data).toEqual(mockKlineData);
      expect(cryptoService.getKlineData).toHaveBeenCalledWith('BTCUSDT');
      done();
    });
  });

  it('should handle error and navigate to home', (done) => {
    const error = new Error('API Error');
    cryptoService.getKlineData.and.returnValue(throwError(() => error));

    resolver.resolve(route).subscribe((data) => {
      expect(data).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });
});
