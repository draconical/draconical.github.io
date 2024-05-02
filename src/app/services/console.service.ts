import { IMessageModel } from './../models/message.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  private messages$: BehaviorSubject<IMessageModel[]> = new BehaviorSubject<IMessageModel[]>([]);

  constructor() { }

  addNewMessage(newMessage: IMessageModel, timeout?: number): void {
    setTimeout(() => {
      const temp = this.messages$.getValue();

      this.messages$.next([...temp, newMessage]);
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
}