import {
  ChartInterval,
  CryptoPrice,
  KlineDataArray,
} from '../models/share.model';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor(private apiService: ApiService) {}

  getPrices(): Observable<CryptoPrice[]> {
    return this.apiService.get<CryptoPrice[]>('/ticker/price');
  }

  getKlineData(
    symbol: string,
    interval: ChartInterval = ChartInterval.ONE_DAY,
    limit: number = 1000
  ): Observable<KlineDataArray> {
    const params = {
      symbol,
      interval,
      limit: limit.toString(),
    };

    return this.apiService.get('/klines', params);
  }
}
