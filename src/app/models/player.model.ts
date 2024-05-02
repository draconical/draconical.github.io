export interface IObject {
  id: number;
  name: string;
  actions: IAction[];
}

export interface IAction {
  command: string;
  func: Function;
}

export interface IPlayer {
  hp: number;
  inventory: IObject[];
  actions: IAction[];
}