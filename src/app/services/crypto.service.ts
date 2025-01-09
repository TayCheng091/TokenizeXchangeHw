import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoPrice } from '../models/share.model';
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
    interval: string = '1d',
    limit: number = 1000
  ): Observable<any> {
    const params = {
      symbol,
      interval,
      limit: limit.toString(),
    };

    return this.apiService.get('/klines', params);
  }
}
