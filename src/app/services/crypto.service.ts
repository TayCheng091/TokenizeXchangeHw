import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CryptoPrice {
  symbol: string;
  price: string;
}

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiUrl = 'https://api.binance.com/api/v3/ticker/price';

  constructor(private http: HttpClient) {}

  getPrices(): Observable<CryptoPrice[]> {
    return this.http.get<CryptoPrice[]>(this.apiUrl);
  }
}
