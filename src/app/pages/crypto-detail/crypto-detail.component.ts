import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CandlestickData,
  IChartApi,
  Time,
  createChart,
} from 'lightweight-charts';
import {
  ChartInterval,
  IntervalOption,
  KlineDataArray,
} from '../../models/share.model';

import { ActivatedRoute } from '@angular/router';
import { ISeriesApi } from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { KlineWebSocketData } from '../../models/share.model';
import { CryptoService } from '../../services/crypto.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-crypto-detail',
  templateUrl: './crypto-detail.component.html',
})
export class CryptoDetailComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLElement>;

  private chart!: IChartApi;
  private candlestickSeries!: ISeriesApi<'Candlestick'>;
  private wsSubscription?: Subscription;
  public symbol!: string;
  public selectedInterval: ChartInterval = ChartInterval.ONE_DAY;
  public intervals: IntervalOption[] = [
    { value: ChartInterval.ONE_MINUTE, viewValue: '1 Minute' },
    { value: ChartInterval.THREE_MINUTES, viewValue: '3 Minutes' },
    { value: ChartInterval.FIVE_MINUTES, viewValue: '5 Minutes' },
    { value: ChartInterval.FIFTEEN_MINUTES, viewValue: '15 Minutes' },
    { value: ChartInterval.THIRTY_MINUTES, viewValue: '30 Minutes' },
    { value: ChartInterval.ONE_HOUR, viewValue: '1 Hour' },
    { value: ChartInterval.TWO_HOURS, viewValue: '2 Hours' },
    { value: ChartInterval.FOUR_HOURS, viewValue: '4 Hours' },
    { value: ChartInterval.SIX_HOURS, viewValue: '6 Hours' },
    { value: ChartInterval.EIGHT_HOURS, viewValue: '8 Hours' },
    { value: ChartInterval.TWELVE_HOURS, viewValue: '12 Hours' },
    { value: ChartInterval.ONE_DAY, viewValue: '1 Day' },
    { value: ChartInterval.THREE_DAYS, viewValue: '3 Days' },
    { value: ChartInterval.ONE_WEEK, viewValue: '1 Week' },
    { value: ChartInterval.ONE_MONTH, viewValue: '1 Month' },
  ];
  klineData: KlineDataArray | null = null;

  constructor(
    private route: ActivatedRoute,
    private wsService: WebsocketService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';
  }

  ngAfterViewInit() {
    this.klineData = this.route.snapshot.data['klineData'];
    if (this.klineData) {
      const candleStickData = this.formatKlineData(this.klineData);
      this.initChart(candleStickData);
    }

    this.connectToWebSocket();
  }

  private formatKlineData(data: KlineDataArray): CandlestickData<Time>[] {
    return data.map((item) => ({
      time: (item[0] / 1000) as Time,
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
  }

  private initChart(candleStickData: CandlestickData<Time>[]) {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: 800,
      height: 400,
      autoSize: true,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });
    this.candlestickSeries = this.chart.addCandlestickSeries({
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price < 0.0001) {
            return price.toFixed(8);
          } else if (price < 0.01) {
            return price.toFixed(6);
          } else if (price < 1) {
            return price.toFixed(4);
          } else {
            return price.toFixed(2);
          }
        },
        minMove: 0.00000001,
      },
    });
    this.candlestickSeries.setData(candleStickData);
  }

  private connectToWebSocket() {
    this.wsSubscription = this.wsService
      .connectToKlineStream(this.symbol, this.selectedInterval)
      .subscribe({
        next: (data: KlineWebSocketData) => {
          const kline = data.k;
          this.updateChart({
            time: (kline.t / 1000) as Time,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
          });
        },
        error: (error) => console.error('WebSocket error:', error),
      });
  }

  private updateChart(candlestick: CandlestickData<Time>) {
    this.candlestickSeries.update(candlestick);
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.wsService.disconnect();
    if (this.chart) {
      this.chart.remove();
    }
  }

  private fetchHistoricalData() {
    this.cryptoService
      .getKlineData(this.symbol, this.selectedInterval)
      .subscribe({
        next: (data: KlineDataArray) => {
          const candleStickData = this.formatKlineData(data);
          this.candlestickSeries.setData(candleStickData);
        },
        error: (error) => {
          console.error('Failed to fetch historical data:', error);
        },
      });
  }

  onIntervalChange(interval: ChartInterval) {
    this.selectedInterval = interval;
    this.wsService.disconnect();
    this.fetchHistoricalData();
    this.connectToWebSocket();
  }
}
