import { RouterModule, Routes } from '@angular/router';

import { CryptoDetailComponent } from './pages/crypto-detail/crypto-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'crypto/:symbol', component: CryptoDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
