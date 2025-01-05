import { Component, OnInit } from '@angular/core';
import { CryptoPrice, CryptoService } from './services/crypto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  cryptoPrices: CryptoPrice[] = [];
  loading = true;
  error = '';

  constructor(private cryptoService: CryptoService) {}

  ngOnInit() {
    this.loadPrices();
  }

  loadPrices() {
    this.cryptoService.getPrices().subscribe({
      next: (data) => {
        this.cryptoPrices = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load crypto prices';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }
}
