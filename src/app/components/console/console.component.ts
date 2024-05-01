import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMessageModel, IMessageSourceEnum } from 'src/app/models/message.model';
import { ConsoleService } from 'src/app/services/console.service';

@Component({
  selector: 'app-console',
  styleUrls: ['console.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="console">
      <div class="console__logs">
        <div class="console__logs__header subheader jost bold">Журнал</div>
        <div class="console__logs__text">
          <div class="message" *ngFor="let message of messages">
            <span class="jost semibold">[{{translateSource(message.source)}}]: </span>
            <span class="jost"[ngClass]="{'italic': message.source === messageSourceTypes.Storyteller}">{{message.value}}</span>
          </div>
        </div>
        <input class="console__input jost" placeholder="Твои действия?" [(ngModel)]="consoleString" (keyup.enter)="onSubmit()">
      </div>
    </div>
  `
})
export class ConsoleComponent {
  messages: IMessageModel[] = [];
  consoleString: string = '';

  messageSourceTypes = IMessageSourceEnum;

  constructor(private consoleService: ConsoleService) { }

  ngOnInit(): void {
    this.consoleService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  onSubmit(): void {
    this.consoleString = '';
  }

  translateSource(source: IMessageSourceEnum): string {
    switch (source) {
      case IMessageSourceEnum.System:
        return 'Система';
      case IMessageSourceEnum.Storyteller:
        return 'Рассказчик';
      case IMessageSourceEnum.Player:
        return 'Игрок';
    }
  }
}
