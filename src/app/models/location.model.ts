import { IObject } from "./player.model";

export enum IMoveDirectionsEnum {
  север = 'north',
  восток = 'east',
  юг = 'south',
  запад = 'west',
}

export interface IMoveDirections {
  north: Function | null;
  east: Function | null;
  south: Function | null;
  west: Function | null;
}

export interface ILocationModel {
  id: number;
  isKnown: boolean;
  description: string;
  tileSrc: string;
  objects: IObject[];
  moveDirections: IMoveDirections;
}