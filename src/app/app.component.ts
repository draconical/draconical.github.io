import { Component } from '@angular/core';
import { IAdversariesEnum } from './services/clash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  adversaryToken = IAdversariesEnum;
}
