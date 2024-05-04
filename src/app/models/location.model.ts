import { IObject } from "./player.model";

export interface IMoveDirections {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}

export interface ILocationModel {
  id: number;
  isKnown: boolean;
  description: string;
  tileSrc: string;
  objects: IObject[];
  moveDirections: IMoveDirections;
}