import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ChartInterval,
  KlineDataArray,
  KlineWebSocketData,
} from '../../models/share.model';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';
import { WebsocketService } from '../../services/websocket.service';
import { CryptoDetailComponent } from './crypto-detail.component';

describe('CryptoDetailComponent', () => {
  let component: CryptoDetailComponent;
  let fixture: ComponentFixture<CryptoDetailComponent>;
  let cryptoService: jasmine.SpyObj<CryptoService>;
  let wsService: jasmine.SpyObj<WebsocketService>;

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

  const mockWsData: KlineWebSocketData = {
    k: {
      t: 1650067200000,
      o: '0.01028900',
      h: '0.01033600',
      l: '0.01024800',
      c: '0.01033000',
      v: '45376.24600000',
    },
  };

  beforeEach(async () => {
    const cryptoSpy = jasmine.createSpyObj('CryptoService', ['getKlineData']);
    const wsSpy = jasmine.createSpyObj('WebsocketService', [
      'connectToKlineStream',
      'disconnect',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CryptoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'BTCUSDT',
              },
              data: {
                klineData: mockKlineData,
              },
            },
          },
        },
        { provide: CryptoService, useValue: cryptoSpy },
        { provide: WebsocketService, useValue: wsSpy },
      ],
    }).compileComponents();

    cryptoService = TestBed.inject(
      CryptoService
    ) as jasmine.SpyObj<CryptoService>;
    wsService = TestBed.inject(
      WebsocketService
    ) as jasmine.SpyObj<WebsocketService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoDetailComponent);
    component = fixture.componentInstance;
    wsService.connectToKlineStream.and.returnValue(of(mockWsData));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize chart with resolver data', () => {
    const chartSpy = spyOn(component as any, 'initChart');
    fixture.detectChanges();

    expect(chartSpy).toHaveBeenCalled();
    const candleStickData = chartSpy.calls.first().args[0] as {
      time: number;
    }[];
    expect(candleStickData[0].time).toBe(1650067200);
  });

  it('should fetch new data when interval changes', () => {
    fixture.detectChanges();
    cryptoService.getKlineData.and.returnValue(of(mockKlineData));

    component.onIntervalChange(ChartInterval.ONE_HOUR);

    expect(cryptoService.getKlineData).toHaveBeenCalledWith(
      'BTCUSDT',
      ChartInterval.ONE_HOUR
    );
    expect(wsService.disconnect).toHaveBeenCalled();
  });

  it('should connect to websocket after initialization', () => {
    fixture.detectChanges();

    expect(wsService.connectToKlineStream).toHaveBeenCalledWith(
      'BTCUSDT',
      component.selectedInterval
    );
  });
});
