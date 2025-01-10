import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let cryptoService: jasmine.SpyObj<CryptoService>;
  let debounceTime: number;

  const mockPrices = [
    { symbol: 'BTCUSDT', price: '45000.00' },
    { symbol: 'ETHUSDT', price: '3000.00' },
    { symbol: 'BNBUSDT', price: '400.00' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CryptoService', ['getPrices']);
    spy.getPrices.and.returnValue(of(mockPrices));

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HomeComponent],
      providers: [{ provide: CryptoService, useValue: spy }],
    }).compileComponents();

    cryptoService = TestBed.inject(
      CryptoService
    ) as jasmine.SpyObj<CryptoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debounceTime = component['debounceTime'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load crypto prices on init', () => {
    expect(cryptoService.getPrices).toHaveBeenCalled();
    expect(component.cryptoPrices).toEqual(mockPrices);
    expect(component.filteredPrices).toEqual(mockPrices);
  });

  it('should filter cryptos based on search term', fakeAsync(() => {
    component.searchTerm = 'ETH';
    component.onSearch();
    tick(debounceTime);

    expect(component.filteredPrices).toEqual([mockPrices[1]]);
  }));

  it('should show all cryptos when search term is empty', fakeAsync(() => {
    component.searchTerm = 'ETH';
    component.onSearch();
    tick(debounceTime);

    component.searchTerm = '';
    component.onSearch();
    tick(debounceTime);

    expect(component.filteredPrices).toEqual(mockPrices);
  }));

  it('should filter case-insensitively', fakeAsync(() => {
    component.searchTerm = 'eth';
    component.onSearch();
    tick(debounceTime);

    expect(component.filteredPrices).toEqual([mockPrices[1]]);
  }));

  it('should not filter if same search term is entered', fakeAsync(() => {
    const filterSpy = spyOn<any>(component, 'filterCryptos');

    component.searchTerm = 'ETH';
    component.onSearch();
    tick(debounceTime);

    component.searchTerm = 'ETH';
    component.onSearch();
    tick(debounceTime);

    expect(filterSpy).toHaveBeenCalledTimes(1);
  }));
});
