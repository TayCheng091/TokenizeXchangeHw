import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';
import { CryptoPrice } from '../../services/crypto.service';

@Component({
  selector: 'app-crypto-card',
  templateUrl: './crypto-card.component.html',
})
export class CryptoCardComponent {
  @Input() crypto!: CryptoPrice;

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(['/crypto', this.crypto.symbol]);
  }
}
