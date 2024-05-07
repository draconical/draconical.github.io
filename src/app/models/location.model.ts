import { IObject } from "./player.model";

export enum IMoveDirectionsEnum {
  север = 'north',
  восток = 'east',
  юг = 'south',
  запад = 'west'
}

export enum IMoveDirectionsAltEnum {
  north = 'север',
  east = 'восток',
  south = 'юг',
  west = 'запад'
}

export interface IMoveDirectionItem {
  name: IMoveDirectionsAltEnum;
  func: Function;
}

export interface IMoveDirections {
  north: IMoveDirectionItem | null;
  east: IMoveDirectionItem | null;
  south: IMoveDirectionItem | null;
  west: IMoveDirectionItem | null;
}

export interface ILocationModel {
  id: number;
  isKnown: boolean;
  description: string;
  tileSrc: string;
  objects: IObject[];
  moveDirections: IMoveDirections;
}