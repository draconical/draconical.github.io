export enum CombinationsEnum {
  Kicker = 0,
  Pair = 1,
  Double = 2,
  Triple = 3,
  Street = 4,
  Fullhouse = 5,
  Quadriple = 6,
  Poker = 7
}

export enum CombinationTypesEnum {
  kicker = 'kicker',
  pair = 'pair',
  double = 'double',
  triple = 'triple',
  street = 'street',
  fullhouse = 'fullhouse',
  quadriple = 'quadriple',
  poker = 'poker',
}

export interface CombinationItemModel {
  isThere: boolean;
  base: CombinationsEnum,
  nominal: number;
}

export interface CombinationsModel {
  kicker: CombinationItemModel;
  pair: CombinationItemModel;
  double: CombinationItemModel;
  triple: CombinationItemModel;
  street: CombinationItemModel;
  fullhouse: CombinationItemModel;
  quadriple: CombinationItemModel;
  poker: CombinationItemModel;
}