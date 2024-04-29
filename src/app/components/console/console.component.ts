import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
        <div class="console__logs__text jost">
          <div>
            [Система]: Добро пожаловать!
          </div>
          <div>
            [Рассказчик]: Ты стоишь на пороге входа в подземелье... Изнутри веет сыростью и приключениями... Готов ли ты войти?
          </div>
        </div>
        <input class="console__input jost" placeholder="Твои действия?" [(ngModel)]="consoleString" (keyup.enter)="onSubmit()">
      </div>
    </div>
  `
})
export class ConsoleComponent {
  consoleString: string = '';

  constructor() { }

  ngOnInit(): void { }

  onSubmit(): void {
    this.consoleString = '';
  }
}
