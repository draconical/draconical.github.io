import { IMoveDirectionsEnum } from './../models/location.model';
import { IMessageSourceEnum } from './../models/message.model';
import { Injectable } from "@angular/core";
import { IAction, IObject } from '../models/player.model';
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
      description: 'Это обыкновенный меч средней длины. На лезвии видны несколько зазубрин.',
      actions: []
    },
    {
      id: 2,
      name: 'рацион',
      description: 'Это завтрак путника - печёная картошка с луком и солью. Должно быть вкусно и, возможно даже, полезно!',
      actions: [
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
      description: 'Это... флейта? Зачем она тут?..',
      actions: [
        {
          command: 'взять',
          func: (context: IContext) => {
            this.objects[2].actions.splice(0, 1);

            context.locationContext.removeItem(3);
            context.playerContext.addItem(3);
  
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: `Ты подбираешь флейта. Пригодится!`
            });

            this.objects[4].description = 'Это старый каменный фонтан. На пьедистале расположена статуя молодого человека, который... когда-то играл на флейте.'

            context.locationContext.removeItem(5);
            context.locationContext.addItem(5, false);
          }
        },
        {
          command: 'использовать',
          func: (context: IContext) => {
            // Тут должен быть функционал для комнаты со змеями
          }
        }
      ]
    },
    {
      id: 4,
      name: 'плющ',
      description: 'Это плющ, под листьями которого скрывается множество плотных ветвей, перекрывающих вход внутрь.',
      actions: [
        {
          command: 'разрубить',
          func: (context: IContext) => {
            if (context.playerContext.checkItemExits(1)) {
              context.locationContext.removeItem(4);
              context.locationContext.modifyMoveDirection(IMoveDirectionsEnum.восток, 'unlock', 2);
              this.questService.setQuestCurrentStep(2, 3);
            } else {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Для это нужен подходящий инструмент... Как насчёт меча?'
              })
            }
          }
        }
      ]
    },
    {
      id: 5,
      name: 'фонтан',
      description: 'Это старый каменный фонтан. На пьедистале расположена статуя молодого человека, который играет на флейте.',
      actions: [
        {
          command: 'изучить',
          func: (context: IContext) => {
            context.locationContext.addItem(3, false);
  
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: `Похоже, что флейта не закреплена...`
            });

            this.objects[4].actions.splice(0, 1);

            context.locationContext.removeItem(5);
            context.locationContext.addItem(5, false);
          }
        }
      ]
    },
  ]

  constructor(
    private consoleService: ConsoleService,
    private questService: QuestService
  ) { }

  private examineItemActions(item: IObject): string {
    const objectCommandNames = item.actions.map((action) => action.command);

    return ` Доступны следующие действия: <br> ${getChipsText(objectCommandNames, 'verb')}`;
  }

  private attachAdditionalAction(item: IObject, additionalActionType: 'get' | 'drop') {
    let additionalAction!: IAction;

    if (additionalActionType === 'get') {
      additionalAction = {
        command: 'выбросить',
        func: (context: IContext) => {
          context.playerContext.removeItem(item.id);
          context.locationContext.addItem(item.id);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Ты бросаешь ${item.name} на пол. Но зачем?..`
          });
        }
      }
    } else {
      additionalAction = {
        command: 'взять',
        func: (context: IContext) => {
          context.locationContext.removeItem(item.id);
          context.playerContext.addItem(item.id);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Ты подбираешь ${item.name}. Пригодится!`
          });
        }
      }
    }

    item.actions.push(additionalAction);
  }

  private attachExamineAction(item: IObject): void {
    // Добавляем функцию осмотра с учётом (возможных) дополнительных функций взятия/броска 
    item.actions.push({
      command: 'осмотреть',
      func: () => {
        this.consoleService.addNewMessage({
          source: IMessageSourceEnum.System,
          value: item.description + this.examineItemActions(item)
        });
      }
    })
  }

  getItem(id: number, additionalActionType?: 'get' | 'drop'): IObject {
    const item: IObject = { ...this.objects[id - 1] };
    item.actions = [...this.objects[id - 1].actions];

    if (additionalActionType) this.attachAdditionalAction(item, additionalActionType);
    this.attachExamineAction(item);
    item.actions.sort((curr, next) => curr.command.localeCompare(next.command));

    return item;
  }
}