import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChartApi, createChart } from 'lightweight-charts';

import { Subscription } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-crypto-detail',
  templateUrl: './crypto-detail.component.html',
})
export class CryptoDetailComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLElement>;

  public symbol!: string;
  private chart!: IChartApi;
  private candlestickSeries: any;
  private wsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wsService: WebsocketService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';
    this.fetchHistoricalData();
    this.connectToWebSocket();
  }

  private fetchHistoricalData() {
    this.cryptoService.getKlineData(this.symbol).subscribe({
      next: (data: any) => {
        const candleStickData = data.map((item: any) => ({
          time: item[0] / 1000,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
        }));

        this.initChart(candleStickData);
        this.candlestickSeries.setData(candleStickData);
      },
      error: (error) => {
        console.error('Failed to fetch historical data:', error);
      },
    });
  }

  private initChart(candleStickData: any) {
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
          // 根據價格範圍返回不同格式
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
      .connectToKlineStream(this.symbol)
      .subscribe({
        next: (data: any) => {
          const kline = data.k;
          this.updateChart({
            time: kline.t / 1000,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
          });
        },
        error: (error) => console.error('WebSocket error:', error),
      });
  }

  private updateChart(candlestick: any) {
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
}
