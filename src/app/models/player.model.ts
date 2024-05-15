export interface IObject {
  id: number;
  name: string;
  description: string;
  actions: IAction[];
}

export interface IAction {
  command: string;
  func: Function;
}

export interface IPlayerModel {
  hp: number;
  inventory: IObject[];
  actions: IAction[];
}