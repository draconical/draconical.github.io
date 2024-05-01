import { Injectable } from "@angular/core";
import { IQuestModel } from "../models/quest.model";
import { ConsoleService } from "./console.service";
import { IMessageSourceEnum } from "../models/message.model";

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  private quests: IQuestModel[] = [
    {
      id: 1, currentStep: 0, steps: [
        () => {
          this.consoleService.addNewMessage({
            source: this.messageSourceTypes.Storyteller,
            value: `Добро пожаловать в Dicegeon!
                    <br> Это мой пет-проект, вдохновленный браузерными играми начала 00-х и MUD-ами.
                    <br> Для меня это такой забавный способ обновить портфолио на Github. Калькуляторы и to-do листы уже не вставляют - сердце просит творческий подход...`,
          });

          setTimeout(() => {
            this.consoleService.addNewMessage({
              source: this.messageSourceTypes.Storyteller,
              value: `Осмотри немного интерфейс и, когда будешь готов(а), введи команду <span class="jost semibold">начать игру</span> в строку ввода ниже.`,
            });
          }, 1500);
        },
      ]
    },
  ];

  messageSourceTypes = IMessageSourceEnum;

  constructor(private consoleService: ConsoleService) {
    this.initIntroQuest();
  }

  private initIntroQuest(): void {
    const quest = this.quests[0];
    quest.steps[quest.currentStep]();
  }

  updateQuestStep(id: number): void {
    const quest = this.quests[id - 1];
    quest.currentStep++;

    if (quest.currentStep === quest.steps.length - 1) {
      quest.steps[quest.currentStep]();
    }
  }
}