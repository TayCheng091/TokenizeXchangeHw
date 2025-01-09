import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading state as false', () => {
    service.isLoading$.subscribe((state) => {
      expect(state).toBeFalse();
    });
  });

  it('should show loading', () => {
    service.show();

    service.isLoading$.subscribe((state) => {
      expect(state).toBeTrue();
    });
  });

  it('should hide loading', () => {
    service.show();

    service.hide();

    service.isLoading$.subscribe((state) => {
      expect(state).toBeFalse();
    });
  });

  it('should emit new state when loading state changes', (done) => {
    const states: boolean[] = [];

    service.isLoading$.subscribe((state) => {
      states.push(state);
      if (states.length === 3) {
        expect(states).toEqual([false, true, false]);
        done();
      }
    });

    service.show();
    service.hide();
  });

  it('should maintain latest state for new subscribers', () => {
    service.show();

    service.isLoading$.subscribe((state) => {
      expect(state).toBeTrue();
    });
  });
});
