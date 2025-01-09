import {
  ChartInterval,
  CryptoPrice,
  KlineDataArray,
} from '../models/share.model';

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockPrices: CryptoPrice[] = [
    { symbol: 'BTCUSDT', price: '45000.00' },
    { symbol: 'ETHUSDT', price: '3000.00' },
  ];

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
    const spy = jasmine.createSpyObj('ApiService', ['get']);
    spy.get.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [CryptoService, { provide: ApiService, useValue: spy }],
    });

    service = TestBed.inject(CryptoService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get crypto prices', () => {
    apiService.get.and.returnValue(of(mockPrices));

    service.getPrices().subscribe((prices) => {
      expect(prices).toEqual(mockPrices);
      expect(apiService.get).toHaveBeenCalledWith('/ticker/price');
    });
  });

  it('should get kline data with default parameters', () => {
    apiService.get.and.returnValue(of(mockKlineData));
    const symbol = 'BTCUSDT';

    service.getKlineData(symbol).subscribe((data) => {
      expect(data).toEqual(mockKlineData);
      expect(apiService.get).toHaveBeenCalledWith('/klines', {
        symbol,
        interval: ChartInterval.ONE_DAY,
        limit: '1000',
      });
    });
  });

  it('should get kline data with custom parameters', () => {
    apiService.get.and.returnValue(of(mockKlineData));
    const symbol = 'BTCUSDT';
    const interval = ChartInterval.ONE_HOUR;
    const limit = 500;

    service.getKlineData(symbol, interval, limit).subscribe((data) => {
      expect(data).toEqual(mockKlineData);
      expect(apiService.get).toHaveBeenCalledWith('/klines', {
        symbol,
        interval,
        limit: limit.toString(),
      });
    });
  });

  it('should handle empty response', () => {
    const emptyData: KlineDataArray = [];
    apiService.get.and.returnValue(of(emptyData));

    service.getKlineData('BTCUSDT').subscribe((data) => {
      expect(data).toEqual([]);
    });
  });
});
