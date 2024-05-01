export enum IMessageSourceEnum {
  System = 'system',
  Storyteller = 'storyteller',
  Player = 'player',
}

export interface IMessageModel {
  source: IMessageSourceEnum;
  value: string;
}