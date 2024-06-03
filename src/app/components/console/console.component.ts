import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMessageModel, IMessageSourceEnum } from 'src/app/models/message.model';
import { ConsoleService } from 'src/app/services/console.service';
import { QuestService } from 'src/app/services/quest.service';
import { PlayerService } from 'src/app/services/player.service';

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
          <div class="message" *ngFor="let message of (messages$ | async)">
            <div class="message__source jost semibold">[{{translateSource(message.source)}}]:</div>
            <div class="message__content jost" [ngClass]="{'italic': message.source === messageSourceTypes.Player}" [innerHTML]="message.value"></div>
          </div>
          <div #blankMessageRef class="message__blank-ref"></div>
        </div>
        <input class="console__input jost" placeholder="Твои действия?" [(ngModel)]="consoleString" (keyup.enter)="onSubmit()">
      </div>
    </div>
  `
})
export class ConsoleComponent {
  @Input() clashInProcess!: BehaviorSubject<boolean>;

  @ViewChild('blankMessageRef', { static: false }) blankMessageRef!: ElementRef<HTMLElement>;

  messages$!: BehaviorSubject<IMessageModel[]>;
  consoleString: string = '';

  messageSourceTypes = IMessageSourceEnum;

  constructor(
    private consoleService: ConsoleService,
    private playerService: PlayerService,
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
    this.messages$ = this.consoleService.getMessages();

    this.consoleService.getUpdateLogScrollbar().subscribe(() => {
      this.updateLogScrollbar();
    })
  }

  private updateLogScrollbar(): void {
    setTimeout(() => {
      const blankMessageRef = this.blankMessageRef.nativeElement;
      blankMessageRef.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  onSubmit(): void {
    if (!this.consoleString || this.clashInProcess.getValue()) return;

    if (this.playerService.checkHp() === 0) {
      this.consoleService.addNewMessage({
        source: IMessageSourceEnum.System,
        value: 'Мертвецы не рассказывают сказки. Но, если CTRL + R, то можно.'
      })
      return;
    }

    this.playerService.tryAction(this.consoleString);
    this.consoleString = '';
  }

  translateSource(source: IMessageSourceEnum): string {
    switch (source) {
      case IMessageSourceEnum.System:
        return 'Система';
      case IMessageSourceEnum.Storyteller:
        return 'Рассказчик';
      case IMessageSourceEnum.Player:
        return 'Ты';
    }
  }
}
