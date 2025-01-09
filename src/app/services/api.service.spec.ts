import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show loading when making request', () => {
    service.get('/test').subscribe();

    httpMock.expectOne('https://api.binance.com/api/v3/test').flush({});
    expect(loadingService.show).toHaveBeenCalled();
  });

  it('should hide loading after request completes', () => {
    service.get('/test').subscribe();

    httpMock.expectOne('https://api.binance.com/api/v3/test').flush({});
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should make GET request with correct URL and params', () => {
    const params = { symbol: 'BTCUSDT', interval: '1d' };

    service.get('/test', params).subscribe();

    const req = httpMock.expectOne(
      'https://api.binance.com/api/v3/test?symbol=BTCUSDT&interval=1d'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should handle error and show alert', (done) => {
    const errorMessage = 'Network Error';
    const alertSpy = spyOn(window, 'alert');

    service.get('/test').subscribe({
      error: () => {
        expect(alertSpy).toHaveBeenCalledWith(
          `Http failure response for https://api.binance.com/api/v3/test: 0 ${errorMessage}`
        );
        done();
      },
    });

    const req = httpMock.expectOne('https://api.binance.com/api/v3/test');
    req.error(new ErrorEvent('Network Error'), { statusText: errorMessage });
  });

  it('should return correct data type', () => {
    interface TestData {
      id: number;
      name: string;
    }

    const mockData: TestData = { id: 1, name: 'Test' };

    service.get<TestData>('/test').subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('https://api.binance.com/api/v3/test');
    req.flush(mockData);
  });

  it('should handle empty params', () => {
    service.get('/test').subscribe();

    const req = httpMock.expectOne('https://api.binance.com/api/v3/test');
    expect(req.request.params.keys().length).toBe(0);
    req.flush({});
  });
});
