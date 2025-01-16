import { ChartInterval } from '../models/share.model';
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

  it('should disconnect websocket when calling disconnect', () => {
    const symbol = 'BTCUSDT';
    const interval = ChartInterval.ONE_DAY;

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
    const interval = ChartInterval.ONE_DAY;

    // First connection
    let subscription = service
      .connectToKlineStream(symbol, interval)
      .subscribe();
    const firstSocket = service['socket$'];

    // Disconnect
    service.disconnect();
    subscription.unsubscribe();

    // Second connection
    subscription = service.connectToKlineStream(symbol, interval).subscribe();
    const secondSocket = service['socket$'];

    // Should be different WebSocket instances
    expect(firstSocket).not.toBe(secondSocket);

    subscription.unsubscribe();
  });
});
