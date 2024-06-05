
import { Injectable } from "@angular/core";
import { IAction, IPlayerModel } from "../models/player.model";
import { MapService } from "./map.service";
import { ConsoleService } from "./console.service";
import { QuestService } from "./quest.service";
import { IMessageSourceEnum } from "../models/message.model";
import { getChipsText } from "../components/helpers/common.helper";
import { ObjectService } from "./object.service";
import { IMoveDirectionsAltEnum, IMoveDirectionsEnum } from "../models/location.model";
import { GameoverService } from "./gameover.service";

export interface IContext {
  playerContext: PlayerService;
  locationContext: MapService;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private player: IPlayerModel = {
    hp: 4,
    inventory: [
      this.objectService.getObject(1, 'get'),
      this.objectService.getObject(2, 'get'),
    ],
    actions: [
      {
        command: 'начать игру', func: () => {
          if (this.mapService.getCurrentLocation().getValue().id !== 0) return;
          this.consoleService.clearMessages();
          this.mapService.setCurrentLocation(1);
          this.questService.setQuestCurrentStep(2);

          this.player.actions.splice(0, 1);
        },
      },
      {
        command: 'проверить инвентарь', func: () => {
          const inventoryItemNames = this.player.inventory.map((item) => item.name);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `В твоём инвентаре есть следующие предметы: ${getChipsText(inventoryItemNames, 'noun')}`
          });

          if (this.questService.checkQuestCurrentStep(2, 1)) {
            this.questService.setQuestCurrentStep(2, 2);
          }
        },
      },
      {
        command: 'идти на', func: (context: IContext, direction: IMoveDirectionsEnum | '') => {
          if (direction === '') {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Куда-куда?..'
            });

            return;
          }

          const command = context.locationContext.getCurrentLocation().getValue().moveDirections[direction]?.func;
          if (command) {
            command();
          } else {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Проход закрыт.'
            });
          }
        },
      },
      {
        command: 'завершить игру', func: () => {
          if (this.checkItemExits(10)) {
            this.gameoverService.toggleStatus();
          } else {
            this.consoleService.addNewMessage({
              source: IMessageSourceEnum.System,
              value: 'Ещё рано. Золотой куш ждёт!'
            });
          }
        },
      },
    ],
  }

  constructor(
    private mapService: MapService,
    private consoleService: ConsoleService,
    private questService: QuestService,
    private objectService: ObjectService,
    private gameoverService: GameoverService
  ) {
    // Удалить это, когда всё будет готово
    this.player.actions[0].func();
  }

  private translateDirection(direction: string): IMoveDirectionsEnum | '' {
    switch (direction) {
      case IMoveDirectionsAltEnum.north:
      case IMoveDirectionsAltEnum.east:
      case IMoveDirectionsAltEnum.south:
      case IMoveDirectionsAltEnum.west:
        return IMoveDirectionsEnum[direction];
      default:
        return '';
    }
  }

  checkItemExits(id: number): boolean {
    return !!this.player.inventory.find((item) => item.id === id);
  }

  tryAction(command: string): void {
    let desiredAction: IAction | null;
    let context!: IContext;
    let direction!: string;

    const lowerCaseCommand = command.toLowerCase();
    const verb = lowerCaseCommand.split(' ')[0];
    const noun = lowerCaseCommand.split(' ')[1];

    // Ищем действие в трёх направлениях - среди действий игрока, предметов инвентаря и объектов локации
    let desiredPlayerAction;
    let desiredInventoryObjectAction;
    let desiredLocationObjectAction;

    desiredPlayerAction = this.player.actions.find(action => action.command === lowerCaseCommand);
    if (lowerCaseCommand.includes('идти на')) {
      desiredPlayerAction = this.player.actions.find((action) => action.command === 'идти на');
      direction = this.translateDirection(lowerCaseCommand.split(' ')[2]);
    }

    if (!desiredPlayerAction) {
      const desiredInventoryObject = this.player.inventory.find((item) => item.name === noun || (item.altName && item.altName === noun));
      desiredInventoryObjectAction = desiredInventoryObject?.actions.find((action) => action.command === verb);
    }

    if (!desiredPlayerAction && !desiredInventoryObjectAction) {
      const currentLocationObjects = this.mapService.getCurrentLocation().getValue().objects;
      const desiredLocationObject = currentLocationObjects.find((item) => item.name === noun || (item.altName && item.altName === noun));
      desiredLocationObjectAction = desiredLocationObject?.actions.find((action) => action.command === verb);
    }

    desiredAction = desiredPlayerAction || desiredInventoryObjectAction || desiredLocationObjectAction || null;

    // Контекст необходим для взаимодействия между предметами инвентаря и объектами локации без круговой зависимости
    context = { playerContext: this, locationContext: this.mapService };

    this.consoleService.addNewMessage({
      source: IMessageSourceEnum.Player,
      value: `Пытаешься ${lowerCaseCommand}... ${noun ? '' : 'что?..'}`
    });

    if (desiredAction) {
      desiredAction.func(context, direction);
    } else {
      this.consoleService.addNewMessage({
        source: IMessageSourceEnum.System,
        value: 'Что-то не то...'
      });
    }
  }

  addItem(id: number, dropActionNeeded: boolean = true): void {
    const item = this.objectService.getObject(id, dropActionNeeded ? 'get' : undefined);
    this.player.inventory.push(item);
  }

  removeObject(id: number): void {
    const itemIndex = this.player.inventory.findIndex((item) => item.id === id);
    this.player.inventory.splice(itemIndex, 1);
  }

  checkHp(): number {
    return this.player.hp;
  }

  modifyHp(amount: number): void {
    this.player.hp += amount;
  }
}