import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CryptoCardComponent } from './crypto-card.component';

describe('CryptoCardComponent', () => {
  let component: CryptoCardComponent;
  let fixture: ComponentFixture<CryptoCardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CryptoCardComponent],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCardComponent);
    component = fixture.componentInstance;

    // 設置必要的 @Input() 數據
    component.crypto = {
      symbol: 'BTCUSDT',
      price: '45000.12345678',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display crypto symbol and formatted price', () => {
    const symbolElement = fixture.debugElement.query(
      By.css('.font-semibold')
    ).nativeElement;
    const priceElement = fixture.debugElement.query(
      By.css('.text-green-500')
    ).nativeElement;

    expect(symbolElement.textContent).toBe('BTCUSDT');
    expect(priceElement.textContent.trim()).toBe('45000.12345678');
  });

  it('should navigate to detail page when clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const cardElement = fixture.debugElement.query(
      By.css('.bg-white')
    ).nativeElement;

    cardElement.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/crypto', 'BTCUSDT']);
  });

  it('should handle click event through onClick method', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.onClick();

    expect(navigateSpy).toHaveBeenCalledWith(['/crypto', 'BTCUSDT']);
  });

  it('should format price correctly for different decimal places', () => {
    // Test with different price values
    const testCases = [
      { input: '45000', expected: '45000.00000000' },
      { input: '0.12345678', expected: '0.12345678' },
      { input: '1234.5', expected: '1234.50000000' },
    ];

    testCases.forEach(({ input, expected }) => {
      component.crypto = {
        symbol: 'BTCUSDT',
        price: input,
      };
      fixture.detectChanges();

      const priceElement = fixture.debugElement.query(
        By.css('.text-green-500')
      ).nativeElement;
      expect(priceElement.textContent.trim()).toBe(expected);
    });
  });

  it('should apply correct CSS classes for styling', () => {
    const cardElement = fixture.debugElement.query(By.css('.bg-white'));

    expect(
      cardElement.nativeElement.classList.contains('rounded-lg')
    ).toBeTrue();
    expect(
      cardElement.nativeElement.classList.contains('shadow-md')
    ).toBeTrue();
    expect(
      cardElement.nativeElement.classList.contains('cursor-pointer')
    ).toBeTrue();
  });
});
