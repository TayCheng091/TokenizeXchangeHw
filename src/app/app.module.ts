import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CryptoCardComponent } from './components/crypto-card/crypto-card.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CryptoDetailComponent } from './pages/crypto-detail/crypto-detail.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CryptoCardComponent,
    CryptoDetailComponent,
    HomeComponent,
    LoadingComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
