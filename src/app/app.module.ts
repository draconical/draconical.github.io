import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiceComponent } from 'src/app/components/dice/dice.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DiceComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
