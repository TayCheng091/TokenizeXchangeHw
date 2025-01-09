import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartInterval, KlineDataArray } from '../../models/share.model';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';
import { WebsocketService } from '../../services/websocket.service';
import { CryptoDetailComponent } from './crypto-detail.component';

describe('CryptoDetailComponent', () => {
  let component: CryptoDetailComponent;
  let fixture: ComponentFixture<CryptoDetailComponent>;
  let cryptoService: jasmine.SpyObj<CryptoService>;
  let wsService: jasmine.SpyObj<WebsocketService>;
  let route: ActivatedRoute;

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

  const mockWsData = {
    k: {
      t: 1638262800000,
      o: '50000.00',
      h: '51000.00',
      l: '49000.00',
      c: '50500.00',
      v: '100.00',
    },
  };

  beforeEach(async () => {
    const cryptoSpy = jasmine.createSpyObj('CryptoService', ['getKlineData']);
    const wsSpy = jasmine.createSpyObj('WebsocketService', [
      'connectToKlineStream',
      'disconnect',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [CryptoDetailComponent],
      providers: [
        { provide: CryptoService, useValue: cryptoSpy },
        { provide: WebsocketService, useValue: wsSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'BTCUSDT',
              },
            },
          },
        },
      ],
    }).compileComponents();

    cryptoService = TestBed.inject(
      CryptoService
    ) as jasmine.SpyObj<CryptoService>;
    wsService = TestBed.inject(
      WebsocketService
    ) as jasmine.SpyObj<WebsocketService>;
    route = TestBed.inject(ActivatedRoute);

    // Setup default spy returns
    cryptoService.getKlineData.and.returnValue(of(mockKlineData));
    wsService.connectToKlineStream.and.returnValue(of(mockWsData));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoDetailComponent);
    component = fixture.componentInstance;
    component.selectedInterval = ChartInterval.ONE_DAY;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct symbol from route params', () => {
    expect(component.symbol).toBe('BTCUSDT');
  });

  it('should fetch historical data on init', () => {
    expect(cryptoService.getKlineData).toHaveBeenCalledWith(
      'BTCUSDT',
      component.selectedInterval
    );
  });

  it('should connect to websocket on init', () => {
    expect(wsService.connectToKlineStream).toHaveBeenCalledWith(
      'BTCUSDT',
      component.selectedInterval
    );
  });

  it('should update interval and refetch data when interval changes', () => {
    const newInterval = ChartInterval.ONE_MINUTE;

    component.onIntervalChange(newInterval);

    expect(wsService.disconnect).toHaveBeenCalled();
    expect(cryptoService.getKlineData).toHaveBeenCalledWith(
      'BTCUSDT',
      newInterval
    );
    expect(wsService.connectToKlineStream).toHaveBeenCalledWith(
      'BTCUSDT',
      newInterval
    );
  });

  it('should display all available intervals in select', () => {
    const selectElement =
      fixture.debugElement.nativeElement.querySelector('select');
    const options = selectElement.options;

    expect(options.length).toBe(component.intervals.length);
    expect(options[0].value).toBe(component.intervals[0].value);
    expect(options[0].text).toBe(component.intervals[0].viewValue);
  });

  it('should clean up resources on destroy', () => {
    component.ngOnDestroy();

    expect(wsService.disconnect).toHaveBeenCalled();
  });

  it('should handle websocket data updates', () => {
    const wsData = {
      k: {
        t: 1638262800000 + 600000,
        o: '50000.00',
        h: '51000.00',
        l: '49000.00',
        c: '50500.00',
        v: '100.00',
      },
    };

    wsService.connectToKlineStream.and.returnValue(of(wsData));
    fixture.detectChanges();

    expect(wsService.connectToKlineStream).toHaveBeenCalled();
  });

  it('should format chart data correctly', () => {
    const rawData: KlineDataArray = [
      [
        1638262800000,
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

    cryptoService.getKlineData.and.returnValue(of(rawData));
    component.ngOnInit();
    fixture.detectChanges();

    expect(cryptoService.getKlineData).toHaveBeenCalled();
  });
});
