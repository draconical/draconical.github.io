import { ClashService } from './clash.service';
import { IMoveDirectionsEnum } from './../models/location.model';
import { IMessageSourceEnum } from './../models/message.model';
import { Injectable } from "@angular/core";
import { IAction, IObject } from '../models/player.model';
import { ConsoleService } from './console.service';
import { IContext } from './player.service';
import { QuestService } from './quest.service';
import { getChipsText, getSemiboldText } from '../components/helpers/common.helper';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private objects: IObject[] = [
    {
      id: 1,
      name: 'меч',
      description: 'Это обыкновенный меч средней длины. На лезвии видны несколько зазубрин.',
      actions: [],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 2,
      name: 'рацион',
      description: 'Это завтрак путника - печёная картошка с луком и солью. Должно быть вкусно и, возможно даже, полезно!',
      actions: [
        {
          command: 'съесть',
          func: (context: IContext) => {
            context.playerContext.removeObject(2);

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
      ],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 3,
      name: 'флейта',
      altName: 'флейту',
      description: 'Это... флейта? Зачем она тут?..',
      actions: [
        {
          command: 'взять',
          func: (context: IContext) => {
            this.objects[2].actions.splice(0, 1);

            context.locationContext.removeObject(3);
            context.playerContext.addItem(3);

            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: `Ты подбираешь флейту. Пригодится!`
            });

            this.objects[4].description = 'Это старый каменный фонтан. На пьедистале расположена статуя молодого человека, который... когда-то играл на флейте.'

            context.locationContext.removeObject(5);
            context.locationContext.addItem(5, false);
          }
        },
      ],
      whenTaken: [
        {
          command: 'использовать',
          func: (context: IContext) => {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: `*фьють-фьють-фьють* А неплохо!`
            });

            if (context.locationContext.checkObjectHp(9) > 0) {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.Storyteller,
                value: `Удивительным образом, под звуки флейты змеи засыпают! Похоже, что сражаться с ними уже и не придётся.`
              }, 0.3)

              context.locationContext.removeObject(9);
              context.locationContext.addItem(10, false);
            }
          }
        }
      ],
      whenDropped: []
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
              context.locationContext.removeObject(4);
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
      ],
      whenTaken: [],
      whenDropped: []
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

            context.locationContext.removeObject(5);
            context.locationContext.addItem(5, false);
          }
        }
      ],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 6,
      name: 'картины',
      description: 'Это череда из трёх картин. На первой изображена длинная лестница, на второй - поле брани, а на третьей - человек, заклинающий змею с помощью музыкального инструмента.',
      actions: [
        {
          command: 'порвать',
          func: (context: IContext) => {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: `Под крякающие звуки ты, с остервенением, рвёшь пыльные полотна. Вот так! В этом склепе нет места искусству!`
            });

            this.objects[5].actions.splice(0, 1);

            context.locationContext.removeObject(6);
          }
        }
      ],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 7,
      name: 'драугр',
      altName: 'драугра',
      hp: 3,
      description: 'Это человекоподобное создание, похожее на ожившего трупа. Оно бродит из стороны в сторону, прекрывая проход дальше.',
      actions: [
        {
          command: 'сразить',
          func: (context: IContext) => {
            if (context.playerContext.checkItemExits(1)) {
              this.clashService.startClash();
              this.clashService.setClashOutcomes(
                () => {
                  context.locationContext.modifyObjectHp(7, -1);

                  if (context.locationContext.checkObjectHp(7) === 0) {
                    this.consoleService.addNewMessage({
                      source: IMessageSourceEnum.Storyteller,
                      value: `Этот удар оказывается для драугра последним! Мёртвым грузом драугр падает на землю. Хотя, он и так уже был мёртв... Так или иначе - путь открыт!`
                    }, 0.1)

                    context.locationContext.removeObject(7);
                    context.locationContext.modifyMoveDirection(IMoveDirectionsEnum.запад, 'unlock', 8);
                  } else {
                    this.consoleService.addNewMessage({
                      source: IMessageSourceEnum.System,
                      value: `Ты наносишь удар драугру! Он получает 1 ед. урона. Его текущее здоровье: ${context.locationContext.checkObjectHp(7)}.`
                    }, 0.1)
                  }
                },
                () => {
                  context.playerContext.modifyHp(-1);

                  this.consoleService.addNewMessage({
                    source: IMessageSourceEnum.System,
                    value: `Драугр наносит удар тебе! Ты получаешь 1 ед. урона. Твоё текущее здоровье: ${context.playerContext.checkHp()}.`
                  }, 0.1)

                  if (context.playerContext.checkHp() === 0) {
                    this.consoleService.addNewMessage({
                      source: IMessageSourceEnum.Storyteller,
                      value: 'Этот удар оказывается для тебя последним. Ну что ж... Быть можешь, в следующей жизни?'
                    }, 0.3);
                  }
                }
              )
            } else {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Против нежити с кулаками?... Не лучшая идея.'
              })
            }
          }
        }
      ],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 8,
      name: 'сундук',
      description: 'Это большой укреплённый сундук, который обещает нечто интересное внтури.',
      actions: [
        {
          command: 'открыть',
          func: (context: IContext) => {
            context.locationContext.addItem(9, false);

            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.Storyteller,
              value: `Со скрипом сундук открывается. На дне его видны золотые монеты, однако поверх них ползают змеи... Похоже, придётся что-то придумать.`
            }, 0.3);

            this.objects[7].actions.splice(0, 1);

            context.locationContext.removeObject(8);
            context.locationContext.addItem(8, false);
          }
        }
      ],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 9,
      name: 'змеи',
      altName: 'змей',
      hp: 3,
      description: 'Это клубок из трёх змей. Они не слишком агрессивны, если не лезть к ним...',
      actions: [
        {
          command: 'сразить',
          func: (context: IContext) => {
            if (context.playerContext.checkItemExits(1)) {
              this.clashService.startClash();
              this.clashService.setClashOutcomes(
                () => {
                  context.locationContext.modifyObjectHp(9, -1);

                  if (context.locationContext.checkObjectHp(9) === 0) {
                    this.consoleService.addNewMessage({
                      source: IMessageSourceEnum.Storyteller,
                      value: `Все змеи повержены! Осталось только вышвырнуть их из сундука и можно прибирать добро к рукам!`
                    }, 0.1)

                    context.locationContext.removeObject(9);
                    context.locationContext.addItem(10, false);
                  } else {
                    this.consoleService.addNewMessage({
                      source: IMessageSourceEnum.System,
                      value: `Одной змеей меньше! Остались ещё ${context.locationContext.checkObjectHp(9)}.`
                    }, 0.1)
                  }
                },
                () => {
                  context.playerContext.modifyHp(-1);

                  this.consoleService.addNewMessage({
                    source: IMessageSourceEnum.System,
                    value: `Змея наносит удар тебе! Ты получаешь 1 ед. урона. Твоё текущее здоровье: ${context.playerContext.checkHp()}.`
                  }, 0.1)

                  if (context.playerContext.checkHp() === 0) {
                    this.consoleService.addNewMessage({
                      source: IMessageSourceEnum.Storyteller,
                      value: 'Этот удар оказывается для тебя последним. Ну что ж... Быть можешь, в следующей жизни?'
                    }, 0.3);
                  }
                }
              )
            } else {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Против змей с кулаками? Придумай что-то получше.'
              })
            }
          }
        }
      ],
      whenTaken: [],
      whenDropped: []
    },
    {
      id: 10,
      name: 'монеты',
      description: 'Это золотые моменты. Много-много золотых монет.',
      actions: [
        {
          command: 'взять',
          func: (context: IContext) => {
            this.objects[9].actions.splice(0, 1);

            context.locationContext.removeObject(10);
            context.playerContext.addItem(10);

            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.Storyteller,
              value: `Превосходно! Все враги повержены, а золото у тебя на руках. Самое время возвращаться назад в деревню.`
            }, 0.3);

            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: `Игра подходит к концу. Используй команду ${getSemiboldText('завершить игру')}.`
            }, 0.6);
          }
        },
      ],
      whenTaken: [],
      whenDropped: []
    },
  ]

  constructor(
    private consoleService: ConsoleService,
    private questService: QuestService,
    private clashService: ClashService,
  ) { }

  private examineItemActions(item: IObject): string {
    const objectCommandNames = item.actions.map((action) => action.command);

    return ` Доступны следующие действия: <br> ${getChipsText(objectCommandNames, 'verb')}`;
  }

  private attachBaseActions(item: IObject, baseActionsType: 'get' | 'drop') {
    let additionalAction!: IAction;

    if (baseActionsType === 'get') {
      additionalAction = {
        command: 'выбросить',
        func: (context: IContext) => {
          context.playerContext.removeObject(item.id);
          context.locationContext.addItem(item.id);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Ты бросаешь ${item.altName || item.name} на пол. Но зачем?..`
          });
        }
      }

      item.actions = item.actions.concat(item.whenTaken);
    } else {
      additionalAction = {
        command: 'взять',
        func: (context: IContext) => {
          context.locationContext.removeObject(item.id);
          context.playerContext.addItem(item.id);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Ты подбираешь ${item.altName || item.name}. Пригодится!`
          });
        }
      }

      item.actions = item.actions.concat(item.whenDropped);
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

  getObject(id: number, baseActionsType?: 'get' | 'drop'): IObject {
    const item: IObject = { ...this.objects[id - 1] };
    item.actions = [...this.objects[id - 1].actions];

    if (baseActionsType) this.attachBaseActions(item, baseActionsType);
    this.attachExamineAction(item);
    item.actions.sort((curr, next) => curr.command.localeCompare(next.command));

    return item;
  }
}