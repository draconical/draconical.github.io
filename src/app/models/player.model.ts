export interface IObject {
  id: number;
  name: string;
  altName?: string;
  description: string;
  actions: IAction[];
  whenTaken: IAction[];
  whenDropped: IAction[];
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