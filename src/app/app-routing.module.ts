import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { CryptoDetailComponent } from './pages/crypto-detail/crypto-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { CryptoDetailResolver } from './resolvers/crypto-detail.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'crypto/:symbol',
    component: CryptoDetailComponent,
    resolve: {
      klineData: CryptoDetailResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
