import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class GameoverService {
  private gameIsOver$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  toggleStatus(): void {
    this.gameIsOver$.next(true);
  }

  getStatus(): BehaviorSubject<boolean> {
    return this.gameIsOver$;
  }
}