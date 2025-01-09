import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  template: `
    <div
      *ngIf="loadingService.isLoading$ | async"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50"
    >
      <img src="assets/images/loading.gif" alt="Loading..." class="w-16 h-16" />
    </div>
  `,
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
