import { ChartInterval, KlineWebSocketData } from '../models/share.model';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any> | null;
  private baseUrl = 'wss://stream.binance.com:9443/ws';
  private isManualDisconnect: boolean = false;

  constructor() {}

  connectToKlineStream(
    symbol: string,
    interval: ChartInterval = ChartInterval.ONE_DAY
  ): Observable<KlineWebSocketData> {
    if (!this.socket$) {
      this.socket$ = webSocket({
        url: `${this.baseUrl}/${symbol.toLowerCase()}@kline_${interval}`,
        deserializer: (msg: MessageEvent) => JSON.parse(msg.data as string),
        closeObserver: {
          next: () => {
            if (!this.isManualDisconnect) {
              alert('WebSocket connection closed accidentally');
            } else {
              this.isManualDisconnect = false;
            }
          },
        },
      });
    }

    return this.socket$.pipe(share());
  }

  disconnect() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.isManualDisconnect = true;
    }
  }
}
