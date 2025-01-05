import { Component, Input } from '@angular/core';

import { CryptoPrice } from '../../services/crypto.service';

@Component({
  selector: 'app-crypto-card',
  templateUrl: './crypto-card.component.html',
})
export class CryptoCardComponent {
  @Input() crypto!: CryptoPrice;
}
