import { Observable, finalize, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.binance.com/api/v3';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    this.loadingService.show();

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params }).pipe(
      tap({
        error: (error) => {
          alert(error.message || 'An error occurred');
        },
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
