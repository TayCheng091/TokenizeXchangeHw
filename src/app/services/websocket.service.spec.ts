import { TestBed } from '@angular/core/testing';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockWebSocket: jasmine.SpyObj<WebSocketSubject<any>>;

  beforeEach(() => {
    mockWebSocket = jasmine.createSpyObj('WebSocketSubject', [
      'next',
      'complete',
      'pipe',
    ]);

    TestBed.configureTestingModule({
      providers: [WebsocketService],
    });

    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should share websocket connection between multiple subscribers', () => {
    const symbol = 'BTCUSDT';
    const interval = '1d';

    // 創建兩個訂閱
    const subscription1 = service
      .connectToKlineStream(symbol, interval)
      .subscribe();
    const subscription2 = service
      .connectToKlineStream(symbol, interval)
      .subscribe();

    // 應該使用相同的 WebSocket 連接
    const socket1 = service['socket$'];
    const socket2 = service['socket$'];
    expect(socket1).toBe(socket2);

    subscription1.unsubscribe();
    subscription2.unsubscribe();
  });

  it('should disconnect websocket when calling disconnect', () => {
    const symbol = 'BTCUSDT';
    const interval = '1d';

    const subscription = service
      .connectToKlineStream(symbol, interval)
      .subscribe();
    const socket = service['socket$'];
    const completeSpy = spyOn(socket as any, 'complete');

    service.disconnect();

    expect(completeSpy).toHaveBeenCalled();
    expect(service['socket$']).toBeNull();

    subscription.unsubscribe();
  });

  it('should create new connection after disconnect', () => {
    const symbol = 'BTCUSDT';
    const interval = '1d';

    // 第一次連接
    let subscription = service
      .connectToKlineStream(symbol, interval)
      .subscribe();
    const firstSocket = service['socket$'];

    // 斷開連接
    service.disconnect();
    subscription.unsubscribe();

    // 第二次連接
    subscription = service.connectToKlineStream(symbol, interval).subscribe();
    const secondSocket = service['socket$'];

    // 應該是不同的 WebSocket 實例
    expect(firstSocket).not.toBe(secondSocket);

    subscription.unsubscribe();
  });
});
