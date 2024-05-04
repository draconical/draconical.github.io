import { IMessageSourceEnum } from './../models/message.model';
import { Injectable } from "@angular/core";
import { IObject } from '../models/player.model';
import { ConsoleService } from './console.service';
import { IContext } from './player.service';
import { QuestService } from './quest.service';
import { getChipsText } from '../components/helpers/common.helper';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private objects: IObject[] = [
    {
      id: 1,
      name: 'меч',
      actions: [
        {
          command: 'осмотреть',
          func: () => {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Это обыкновенный меч средней длины. На лезвии видны несколько зазубрин.' + this.examineItemActions(1)
            });
          }
        }
      ]
    },
    {
      id: 2,
      name: 'рацион',
      actions: [
        {
          command: 'осмотреть',
          func: () => {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Это завтрак путника - печёная картошка с луком и солью. Должно быть вкусно и, возможно даже, полезно!' + this.examineItemActions(2)
            });
          }
        },
        {
          command: 'съесть',
          func: (context: IContext) => {
            context.playerContext.removeItem(2);

            if (context.playerContext.checkHp() < 4) {
              context.playerContext.modifyHp(1);

              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Здоровье восстановлено (+1 ед).'
              });
            } else {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Здоровье уже максимальное... Но было вкусно.'
              });
            }
          }
        }
      ]
    },
    {
      id: 3,
      name: 'флейта',
      actions: [
        {
          command: 'осмотреть',
          func: () => {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Это... флейта? Зачем она тут?..' + this.examineItemActions(3)
            });
          }
        }
      ]
    },
    {
      id: 4,
      name: 'плющ',
      actions: [
        {
          command: 'осмотреть',
          func: () => {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Это плющ, под листьями которого скрывается множество плотных ветвей, перекрывающих вход внутрь.' + this.examineItemActions(4)
            });
          }
        },
        {
          command: 'разрубить',
          func: (context: IContext) => {
            context.locationContext.removeItem(4);
            context.locationContext.modifyMoveDirection('west', 'unlock');
            this.questService.updateQuestStep(2);
          }
        }
      ]
    },
  ]

  constructor(
    private consoleService: ConsoleService,
    private questService: QuestService
  ) { }

  private examineItemActions(id: number): string {
    const objectCommandNames = this.objects[id - 1].actions.map((action) => action.command);

    return `<br> Доступны следующие действия: <br> ${getChipsText(objectCommandNames, 'verb')}`;
  }

  getItem(id: number): IObject {
    return this.objects[id - 1];
  }
}