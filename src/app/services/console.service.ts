import { IMessageModel } from './../models/message.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  private messages$: BehaviorSubject<IMessageModel[]> = new BehaviorSubject<IMessageModel[]>([]);

  constructor() { }

  addNewMessage(newMessage: IMessageModel): void {
    const temp = this.messages$.getValue();

    this.messages$.next([...temp, newMessage]);
  }

  clearMessages(): void {
    this.messages$.next([]);
  }

  getMessages(): BehaviorSubject<IMessageModel[]> {
    return this.messages$;
  }
}