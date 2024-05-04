import { Injectable } from "@angular/core";
import { IQuestModel } from "../models/quest.model";
import { ConsoleService } from "./console.service";
import { IMessageSourceEnum } from "../models/message.model";
import { getSemiboldText } from "../components/helpers/common.helper";

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  private quests: IQuestModel[] = [
    {
      id: 1, currentStep: 0, steps: [
        () => {
          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.Storyteller,
            value: `
                    Добро пожаловать в Dicegeon!
                    <br> Это мой пет-проект, вдохновленный браузерными MMO начала 00-х и MUD-ами.
                    <br> Для меня это такой забавный способ обновить портфолио на Github. Калькуляторы и to-do листы уже не вставляют - сердце просит творчества...
                   `,
          }, 1);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.Storyteller,
            value: `Осмотри немного интерфейс и, когда будешь готов(а), введи команду ${getSemiboldText('начать игру')} в строку ввода ниже.`,
          }, 2);
        },
        () => {
          // Открываем игру через активацию первого сюжетного квеста
          this.initQuestByStep(2);
        }
      ]
    },
    {
      id: 2, currentStep: 0, steps: [
        () => {
          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.Storyteller,
            value: `
                    Спустя пару часов брождения по лесу, ты находить каменное строение, которое, похоже, ведёт вниз - в тот самый склеп, что описывали местные жители.
                    <br> Вход зарос плющём. Но ты ведь подготовился, верно?..
                   `,
          }, 0.3);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Самое время ${getSemiboldText('проверить инвентарь')}.`,
          }, 0.6);
        },
        () => {
          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.Storyteller,
            value: `Меч мог бы сгодиться! Итак, вернёмся к плющу.`,
          }, 0.3);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Ты можешь осматривать различные элементы - будь то вещи из инвентаря или объекты окружения. Попробуй ${getSemiboldText('осмотреть плющ')}.`,
          }, 0.6);
        },
        () => {
          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.Storyteller,
            value: `Ты достаёшь меч из ножек и берёшься за дело. Серия ударов, треск ветвей и вот - путь открыт!`
          }, 0.3);

          this.consoleService.addNewMessage({
            source: IMessageSourceEnum.System,
            value: `Теперь ты можешь передвигаться между локациями. Попробуй ${getSemiboldText('идти на восток')}.`
          }, 0.6);
        },
      ]
    },
  ];

  constructor(
    private consoleService: ConsoleService,
  ) {
    // Вводный квест, необходимый для инициализации игрового процесса
    // this.initQuestByStep(0);
  }

  initQuestByStep(questId: number, stepNum?: number): void {
    const quest = this.quests[questId - 1];
    quest.steps[stepNum ? stepNum : quest.currentStep]();
  }

  checkQuestCurrentStep(questId: number, stepNum: number): boolean {
    return this.quests[questId - 1].currentStep === stepNum;
  }

  updateQuestStep(id: number): void {
    const quest = this.quests[id - 1];
    quest.currentStep++;

    // Проверка на финальный шаг (подразумевается, что он будет автоматизированным)
    if (quest.currentStep === quest.steps.length - 1) {
      quest.steps[quest.currentStep]();
    }
  }
}