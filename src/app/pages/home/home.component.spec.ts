import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CryptoCardComponent } from '../../components/crypto-card/crypto-card.component';
import { CryptoPrice } from '../../models/share.model';
import { CryptoService } from '../../services/crypto.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let cryptoService: jasmine.SpyObj<CryptoService>;

  const mockCryptoPrices: CryptoPrice[] = [
    { symbol: 'BTCUSDT', price: '45000.00' },
    { symbol: 'ETHUSDT', price: '3000.00' },
    { symbol: 'BNBUSDT', price: '400.00' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CryptoService', ['getPrices']);
    spy.getPrices.and.returnValue(of(mockCryptoPrices));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent, CryptoCardComponent],
      providers: [{ provide: CryptoService, useValue: spy }],
    }).compileComponents();

    cryptoService = TestBed.inject(
      CryptoService
    ) as jasmine.SpyObj<CryptoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load crypto prices on init', () => {
    expect(cryptoService.getPrices).toHaveBeenCalled();
    expect(component.cryptoPrices).toEqual(mockCryptoPrices);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should display loading state initially', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingElement =
      fixture.debugElement.nativeElement.querySelector('.animate-spin');
    expect(loadingElement).toBeTruthy();
  });

  it('should display crypto cards when data is loaded', () => {
    const cards =
      fixture.debugElement.nativeElement.querySelectorAll('app-crypto-card');
    expect(cards.length).toBe(mockCryptoPrices.length);
  });

  it('should handle error when loading prices fails', () => {
    const errorMessage = 'Failed to load crypto prices';
    cryptoService.getPrices.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.loadPrices();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe(errorMessage);

    const errorElement =
      fixture.debugElement.nativeElement.querySelector('.text-red-500');
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('should not display error message when there is no error', () => {
    const errorElement =
      fixture.debugElement.nativeElement.querySelector('.text-red-500');
    expect(errorElement).toBeNull();
  });

  it('should pass correct data to crypto-card components', () => {
    fixture.detectChanges();

    const cardElements = fixture.debugElement.queryAll(
      By.directive(CryptoCardComponent)
    );

    expect(cardElements.length).toBe(mockCryptoPrices.length);

    const firstCardComponent = cardElements[0].componentInstance;
    expect(firstCardComponent.crypto).toEqual(mockCryptoPrices[0]);
  });

  it('should update view when new prices are loaded', () => {
    const newPrices: CryptoPrice[] = [
      { symbol: 'BTCUSDT', price: '46000.00' },
      { symbol: 'ETHUSDT', price: '3100.00' },
    ];

    cryptoService.getPrices.and.returnValue(of(newPrices));
    component.loadPrices();
    fixture.detectChanges();

    expect(component.cryptoPrices).toEqual(newPrices);
    const cards =
      fixture.debugElement.nativeElement.querySelectorAll('app-crypto-card');
    expect(cards.length).toBe(newPrices.length);
  });
});
