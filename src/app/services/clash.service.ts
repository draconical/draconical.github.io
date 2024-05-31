import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { ConsoleService } from "./console.service";
import { IMessageSourceEnum } from "../models/message.model";

export enum IAdversariesEnum {
  player = 'player',
  opponent = 'opponent',
}

export interface IClashOutcomes {
  win: Function;
  lose: Function;
}

@Injectable({
  providedIn: 'root',
})
export class ClashService {
  private clashInProcess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private playerRoll$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private opponentRoll$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  private clashOutcomes: IClashOutcomes | null = null;

  private winner$: BehaviorSubject<IAdversariesEnum | null> = new BehaviorSubject<IAdversariesEnum | null>(null);

  constructor(private consoleService: ConsoleService) {
    console.log('Сервис поединков запущен!');

    combineLatest([this.playerRoll$, this.opponentRoll$])
      .subscribe(([pRoll, oRoll]) => {
        if (!pRoll || !oRoll) return;

        if (pRoll >= oRoll) {
          this.winner$.next(IAdversariesEnum.player);
        } else if (pRoll < oRoll) {
          this.winner$.next(IAdversariesEnum.opponent);
        }
      });
  }

  setRollValue(adversaryToken: IAdversariesEnum, rollResult: number | null): void {
    if (adversaryToken === IAdversariesEnum.player) {
      this.playerRoll$.next(rollResult);
    } else {
      this.opponentRoll$.next(rollResult);
    }
  }

  getWinner(): BehaviorSubject<IAdversariesEnum | null> {
    return this.winner$;
  }

  getInProcessStatus(): BehaviorSubject<boolean> {
    return this.clashInProcess;
  }

  startClash(): void {
    this.clashInProcess.next(true);
  }

  setClashOutcomes(winOutcome: Function, loseOutcome: Function): void {
    this.clashOutcomes = {
      win: winOutcome,
      lose: loseOutcome
    };
  }

  endClash(): void {
    this.clashInProcess.next(false);

    this.winner$.getValue() === IAdversariesEnum.player
      ? this.clashOutcomes?.win() : this.clashOutcomes?.lose();

    this.consoleService.addNewMessage({
      source: IMessageSourceEnum.System,
      value: `Ты ${this.winner$.getValue() === IAdversariesEnum.player ? ' проходишь' : ' проваливаешь'} проверку.`
    });

    this.opponentRoll$.next(null);
    this.playerRoll$.next(null);
    this.clashOutcomes = null;
  }
}