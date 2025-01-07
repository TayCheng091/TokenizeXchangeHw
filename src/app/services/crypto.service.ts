import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CryptoPrice {
  symbol: string;
  price: string;
}

export interface CandleStickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private baseUrl = 'https://api.binance.com/api/v3';

  constructor(private http: HttpClient) {}

  getPrices(): Observable<CryptoPrice[]> {
    return this.http.get<CryptoPrice[]>(`${this.baseUrl}/ticker/price`);
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

    return this.http.get(`${this.baseUrl}/klines`, { params });
  }
}
