import { Injectable } from "@angular/core";
import { IAction, IPlayer } from "../models/player.model";
import { MapService } from "./map.service";
import { ConsoleService } from "./console.service";
import { QuestService } from "./quest.service";
import { IMessageSourceEnum } from "../models/message.model";
import { getChipsText } from "../components/helpers/common.helper";

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private player: IPlayer = {
    hp: 4,
    inventory: [
      {
        id: 1,
        name: 'меч',
        actions: [
          {
            command: 'осмотреть',
            func: () => {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Это обыкновенный меч средней длины. На лезвии видны несколько зазубрин. Таким можно и навредить...'
              })
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
                value: 'Это завтрак путника - печёная картошка с луком и солью. Должно быть вкусно и, возможно даже, полезно!'
              })
            }
          }
        ]
      },
      {
        id: 3,
        name: 'гусли',
        actions: [
          {
            command: 'осмотреть',
            func: () => {
              this.consoleService.addNewMessage({
                source: IMessageSourceEnum.System,
                value: 'Это... гусли? Зачем они тут?..'
              })
            }
          }
        ]
      }
    ],
    actions: [
      {
        command: 'начать игру', func: () => {
          if (this.mapService.getCurrentLocation().getValue().id !== 0) return;
          this.consoleService.clearMessages();
          this.mapService.setCurrentLocation(1);
          this.questService.updateQuestStep(1);
        },
      },
      {
        command: 'проверить инвентарь', func: () => {
          const inventoryItemNames = this.player.inventory.map((item) => item.name);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `В твоём инвентаре есть следующие предметы: ${getChipsText(inventoryItemNames, 'noun')}`
          })

          if (this.questService.checkQuestCurrentStep(2, 0)) {
            this.questService.updateQuestStep(2);
            this.questService.initQuestByStep(2);
          }
        },
      },
    ],
  }

  constructor(
    private mapService: MapService,
    private consoleService: ConsoleService,
    private questService: QuestService,
  ) {
    this.player.actions[0].func();
  }

  tryAction(command: string): void {
    let desiredAction!: IAction | null;
    const lowerCaseCommand = command.toLowerCase();
    const verb = lowerCaseCommand.split(' ')[0];
    const noun = lowerCaseCommand.split(' ')[1];

    // Ищем действие в трёх направлениях - среди действий игрока, предметов инвентаря и объектов локации
    const desiredPlayerAction = this.player.actions.find(action => action.command === lowerCaseCommand);

    const desiredInventoryObject = this.player.inventory.find((item) => item.name === noun);
    const desiredInventoryObjectAction = desiredInventoryObject?.actions.find((action) => action.command === verb);

    const currentLocationObjects = this.mapService.getCurrentLocation().getValue().objects;
    const desiredLocationObject = currentLocationObjects.find((item) => item.name === noun);
    const desiredLocationObjectAction = desiredLocationObject?.actions.find((action) => action.command === verb);

    desiredAction = desiredPlayerAction || desiredInventoryObjectAction || desiredLocationObjectAction || null;

    this.consoleService.addNewMessage({
      source: IMessageSourceEnum.Player,
      value: `Пытаешься ${lowerCaseCommand}... ${noun ? '' : 'что?..'}`
    });

    if (desiredAction) {
      desiredAction.func();
    } else {
      this.consoleService.addNewMessage({
        source: IMessageSourceEnum.System,
        value: 'Что-то не то...'
      });
    }
  }
}