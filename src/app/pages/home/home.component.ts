import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';

import { CryptoPrice } from '../../models/share.model';
import { CryptoService } from '../../services/crypto.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  cryptoPrices: CryptoPrice[] = [];
  filteredPrices: CryptoPrice[] = [];
  searchTerm = '';
  error = '';
  cardHeight = 116;
  itemSize = this.cardHeight;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private debounceTime = 500;

  constructor(
    private cryptoService: CryptoService,
    private loadingService: LoadingService,
    private ref: ChangeDetectorRef
  ) {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe({
        next: (term) => {
          this.loadingService.show();
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

  ngAfterViewInit() {
    this.setItemSize();
    this.ref.detectChanges();
  }

  setItemSize(): void {
    const width = window.innerWidth,
      gap = 16;
    let cols = 1;

    if (width >= 1280) {
      cols = 4; // xl
    } else if (width >= 1024) {
      cols = 3; // lg
    } else if (width >= 768) {
      cols = 2; // md
    }

    this.itemSize = this.cardHeight / cols + gap;
  }

  @HostListener('window:resize')
  onResize() {
    this.setItemSize();
  }
}
