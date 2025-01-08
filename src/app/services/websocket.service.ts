import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

export interface KlineData {
  t: number; // Kline start time
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  c: string; // Close price
  v: string; // Volume
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any> | null;
  private baseUrl = 'wss://stream.binance.com:9443/ws';

  constructor() {}

  connectToKlineStream(
    symbol: string,
    interval: string = '1d'
  ): Observable<KlineData> {
    if (!this.socket$) {
      this.socket$ = webSocket({
        url: `${this.baseUrl}/${symbol.toLowerCase()}@kline_${interval}`,
        deserializer: (msg: MessageEvent) => JSON.parse(msg.data as string),
      });
    }

    return this.socket$.pipe(share());
  }

  disconnect() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}
