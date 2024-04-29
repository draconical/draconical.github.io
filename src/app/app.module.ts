import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiceComponent } from 'src/app/components/dice/dice.component';
import { ConsoleComponent } from './components/console/console.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DiceComponent,
    ConsoleComponent,
    MapComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
