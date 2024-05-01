export enum ICombinationsEnum {
  Kicker = 0,
  Pair = 1,
  Double = 2,
  Triple = 3,
  Street = 4,
  Fullhouse = 5,
  Quadriple = 6,
  Poker = 7
}

export enum ICombinationTypesEnum {
  kicker = 'kicker',
  pair = 'pair',
  double = 'double',
  triple = 'triple',
  street = 'street',
  fullhouse = 'fullhouse',
  quadriple = 'quadriple',
  poker = 'poker',
}

export interface ICombinationItemModel {
  isThere: boolean;
  base: ICombinationsEnum;
  nominal: number;
}

export interface ICombinationsModel {
  kicker: ICombinationItemModel;
  pair: ICombinationItemModel;
  double: ICombinationItemModel;
  triple: ICombinationItemModel;
  street: ICombinationItemModel;
  fullhouse: ICombinationItemModel;
  quadriple: ICombinationItemModel;
  poker: ICombinationItemModel;
}