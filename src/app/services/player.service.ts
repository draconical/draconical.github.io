import { Injectable } from "@angular/core";
import { IPlayer } from "../models/player.model";
import { MapService } from "./map.service";
import { ConsoleService } from "./console.service";
import { QuestService } from "./quest.service";
import { IMessageSourceEnum } from "../models/message.model";

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private player: IPlayer = {
    hp: 4,
    inventory: [],
    actions: [
      {
        command: 'начать игру', func: () => {
          if (this.mapService.getCurrentLocation().getValue().id !== 0) return;
          this.consoleService.clearMessages();
          this.mapService.setCurrentLocation(1);
          this.questService.updateQuestStep(1);
        }
      },
    ],
  }

  constructor(
    private mapService: MapService,
    private consoleService: ConsoleService,
    private questService: QuestService,
  ) { }

  tryAction(command: string): void {
    const lowerCaseCommand = command.toLocaleLowerCase();
    const desiredAction = this.player.actions.find(action => action.command === command);

    this.consoleService.addNewMessage({
      source: IMessageSourceEnum.Player,
      value: `Пытаешься ${lowerCaseCommand}...`
    });

    if (desiredAction) {
      desiredAction.func();
    } else {
      this.consoleService.addNewMessage({
        source: IMessageSourceEnum.System,
        value: 'Некорректная команда.'
      });
    }
  }
}