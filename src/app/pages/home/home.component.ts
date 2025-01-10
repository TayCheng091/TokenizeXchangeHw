import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs';

import { CryptoPrice } from '../../models/share.model';
import { CryptoService } from '../../services/crypto.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  cryptoPrices: CryptoPrice[] = [];
  filteredPrices: CryptoPrice[] = [];
  searchTerm = '';
  error = '';
  isSearching = false;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private debounceTime = 500;

  constructor(
    private cryptoService: CryptoService,
    private loadingService: LoadingService
  ) {
    this.searchSubscription = this.searchSubject
      .pipe(
        tap(() => this.loadingService.show()),
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe({
        next: (term) => {
          this.filterCryptos(term);
          this.loadingService.hide();
        },
        error: () => {
          this.loadingService.hide();
        },
      });
  }

  ngOnInit() {
    this.cryptoService.getPrices().subscribe({
      next: (prices) => {
        this.cryptoPrices = prices;
        this.filteredPrices = prices;
        this.error = '';
      },
      error: (error) => {
        console.error('Failed to fetch prices:', error);
        this.error = 'Failed to load crypto prices. Please try again later.';
      },
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private filterCryptos(searchTerm: string) {
    if (!searchTerm) {
      this.filteredPrices = this.cryptoPrices;
      return;
    }

    const term = searchTerm.toUpperCase();
    this.filteredPrices = this.cryptoPrices.filter((crypto) =>
      crypto.symbol.includes(term)
    );
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }
}
