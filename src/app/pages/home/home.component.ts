import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';

import { CryptoPrice } from '../../models/share.model';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  cryptoPrices: CryptoPrice[] = [];
  filteredPrices: CryptoPrice[] = [];
  searchTerm = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private debounceTime = 500;

  constructor(private cryptoService: CryptoService) {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe((term) => {
        this.filterCryptos(term);
      });
  }

  ngOnInit() {
    this.cryptoService.getPrices().subscribe((prices) => {
      this.cryptoPrices = prices;
      this.filteredPrices = prices;
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
