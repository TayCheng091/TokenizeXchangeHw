import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CryptoCardComponent } from './components/crypto-card/crypto-card.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent, CryptoCardComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
