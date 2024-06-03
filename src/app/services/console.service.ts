import { IMessageModel } from './../models/message.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  private messages$: BehaviorSubject<IMessageModel[]> = new BehaviorSubject<IMessageModel[]>([]);
  private updateLogScrollbar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  addNewMessage(newMessage: IMessageModel, timeout?: number): void {
    setTimeout(() => {
      const temp = this.messages$.getValue();

      this.messages$.next([...temp, newMessage]);

      this.updateLogScrollbar$.next(true);
    }, timeout ? timeout * 1000 : 0);
  }

  clearMessages(): void {
    setTimeout(() => {
      this.messages$.next([]);
    }, 0);
  }

  getMessages(): BehaviorSubject<IMessageModel[]> {
    return this.messages$;
  }

  getUpdateLogScrollbar(): BehaviorSubject<boolean> {
    return this.updateLogScrollbar$;
  }
}