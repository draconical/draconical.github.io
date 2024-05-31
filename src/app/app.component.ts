import { Component, OnInit } from '@angular/core';
import { ClashService, IAdversariesEnum } from './services/clash.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  clashInProcess!: BehaviorSubject<boolean>;
  adversaryToken = IAdversariesEnum;

  constructor(private clashService: ClashService) { }

  ngOnInit(): void {
    this.clashInProcess = this.clashService.getInProcessStatus();
  }
}
