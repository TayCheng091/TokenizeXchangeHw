import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { KlineDataArray } from '../models/share.model';
import { CryptoService } from '../services/crypto.service';

@Injectable({
  providedIn: 'root',
})
export class CryptoDetailResolver implements Resolve<KlineDataArray | null> {
  constructor(private cryptoService: CryptoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<KlineDataArray | null> {
    const symbol = route.paramMap.get('symbol') || '';

    return this.cryptoService.getKlineData(symbol).pipe(
      map((data) => data),
      catchError((error) => {
        console.error('Failed to fetch kline data:', error);
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
