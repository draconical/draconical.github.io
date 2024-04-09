import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, combineLatest, takeUntil } from "rxjs";

export enum AdversariesEnum {
  player = 'player',
  opponent = 'opponent',
}

@Injectable({
  providedIn: 'root',
})
export class ClashService {
  private playerRoll$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private opponentRoll$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  private winner$: BehaviorSubject<AdversariesEnum | null> = new BehaviorSubject<AdversariesEnum | null>(null);

  private destroy$: Subject<boolean> = new Subject();

  constructor() {
    console.log('Сервис поединков запущен!');

    combineLatest([this.playerRoll$, this.opponentRoll$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([pRoll, oRoll]) => {
      if (!pRoll || !oRoll) return;

      if (pRoll > oRoll) {
        console.warn('Победа игрока!');
      } else if (pRoll < oRoll) {
        console.warn('Победа оппонента!');
      } else {
        console.warn('Ничья!');
      }
    })
  }

  setRollValue(adversaryToken: AdversariesEnum, rollResult: number | null): void {
    if (adversaryToken === AdversariesEnum.player) {
      this.playerRoll$.next(rollResult);
    } else {
      this.opponentRoll$.next(rollResult);
    }
  }

  getWinner(): BehaviorSubject<AdversariesEnum | null> {
    return this.winner$;
  }
}