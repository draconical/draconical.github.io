import { Component, OnInit } from '@angular/core';
import { ClashService, IAdversariesEnum } from './services/clash.service';
import { BehaviorSubject } from 'rxjs';
import { GameoverService } from './services/gameover.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  clashInProcess$!: BehaviorSubject<boolean>;
  adversaryToken = IAdversariesEnum;

  gameIsOver$!: BehaviorSubject<boolean>;

  constructor(private clashService: ClashService, private gameoverService: GameoverService) { }

  ngOnInit(): void {
    this.clashInProcess$ = this.clashService.getInProcessStatus();
    this.gameIsOver$ = this.gameoverService.getStatus();
  }
}
