import { DiceModel } from './../../models/dice.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CombinationsModel, CombinationsEnum, CombinationTypesEnum } from 'src/models/combination.model';

@Component({
  selector: 'app-dice',
  styleUrls: ['dice.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="button-panel">
        <button (click)="generateDices()">Сделать бросок</button>
        <button *ngIf="currentReroll.length > 0 && !rerollAlreadyDone" (click)="rerollDices()">Перебросить выбранные кости</button>
    </div>
    <div class="dice-set" *ngIf="dices && dices.length > 0">
        <div class="dice" *ngFor="let dice of dices" [ngClass]="{ 'checked': dice.checkedForReroll }" (click)="checkDiceForReroll(dice)">
            <div class="num">{{ dice.value }}</div>   
        </div>
    </div>
    <div *ngIf="!dices" class="dice-set">
        <div class="dice"><div class="num">d6</div></div>
    </div>
    <div *ngIf="result" class="result">
        Результат: {{ result }}
    </div>
  `
})
export class DiceComponent {
  dices!: DiceModel[];

  rerollLimit: number = 2;
  currentReroll: number[] = [];
  rerollAlreadyDone: boolean = false;

  result = '';

  constructor() { }

  ngOnInit(): void { }

  checkDiceForReroll(dice: DiceModel): void {
    if (dice.checkedForReroll === false) {
      if (this.currentReroll.length >= this.rerollLimit || this.rerollAlreadyDone) return;
    }

    dice.checkedForReroll = !dice.checkedForReroll;
    this._calculateCurrentReroll();
  }

  generateDices(): void {
    const newSet: DiceModel[] = [];

    for (let i = 1; i <= 5; i++) {
      newSet.push(this._createDiceInstance());
    }

    this.dices = newSet;
    this.currentReroll = [];
    this.rerollAlreadyDone = false;

    this._sortDices();

    this._calcCombination();
  }

  rerollDices(): void {
    this.currentReroll.forEach((diceIndex) => {
      this.dices[diceIndex] = this._createDiceInstance();
    });

    this.currentReroll = [];
    this.rerollAlreadyDone = true;

    this._calcCombination();
  }

  private _randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private _calculateCurrentReroll(): void {
    const diceIndexes: number[] = [];

    this.dices.forEach((dice, i) => {
      if (dice.checkedForReroll) diceIndexes.push(i);
    });

    this.currentReroll = diceIndexes;
  }

  private _createDiceInstance(): DiceModel {
    return {
      value: this._randomInt(1, 5),
      checkedForReroll: false
    }
  }

  private _sortDices(): void {
    this.dices.sort((a, b) => a.value - b.value);
  }

  private _calcCombination(): void {
    const nums = [...this.dices]
      .sort((a, b) => a.value - b.value)
      .map((dice) => dice.value);

    const combinations: CombinationsModel = {
      kicker: { isThere: false, base: CombinationsEnum.Kicker, nominal: 0 },
      pair: { isThere: false, base: CombinationsEnum.Pair, nominal: 0 },
      double: { isThere: false, base: CombinationsEnum.Double, nominal: 0 },
      triple: { isThere: false, base: CombinationsEnum.Triple, nominal: 0 },
      street: { isThere: false, base: CombinationsEnum.Street, nominal: 0 },
      fullhouse: { isThere: false, base: CombinationsEnum.Fullhouse, nominal: 0 },
      quadriple: { isThere: false, base: CombinationsEnum.Quadriple, nominal: 0 },
      poker: { isThere: false, base: CombinationsEnum.Poker, nominal: 0 }
    }

    const setCombinationValue = (type: CombinationTypesEnum, nominal: number) => {
      combinations[type].isThere = true;
      combinations[type].nominal = nominal;
    }

    const checkCombinations = () => {
      const isStreet = nums.reduce((prev, curr) => {
        return (curr === prev + 1) ? curr : 0;
      });

      if (isStreet !== 0) {
        setCombinationValue(CombinationTypesEnum.street, isStreet);
        return;
      }

      for (let i = 1; i <= 6; i++) {
        const filtered = nums.filter((num) => num === i);

        switch (filtered.length) {
          case 1:
            setCombinationValue(CombinationTypesEnum.kicker, i);
            break;
          case 2:
            if (!combinations.pair.isThere) {
              setCombinationValue(CombinationTypesEnum.pair, i);
            } else {
              setCombinationValue(CombinationTypesEnum.double, Number(`${i}${combinations.pair.nominal}`));
            }
            break;
          case 3:
            setCombinationValue(CombinationTypesEnum.triple, i);
            break;
          case 4:
            setCombinationValue(CombinationTypesEnum.quadriple, i);
            break;
          case 5:
            setCombinationValue(CombinationTypesEnum.poker, i);
            break;
          default:
            break;
        }

        if (combinations.triple.isThere && combinations.pair.isThere) {
          setCombinationValue(CombinationTypesEnum.fullhouse, Number(`${combinations.triple.nominal}${combinations.pair.nominal}`));
        }
      }
    }

    const setResult = () => {
      const resultTypes: CombinationTypesEnum[] = [
        CombinationTypesEnum.poker,
        CombinationTypesEnum.quadriple,
        CombinationTypesEnum.fullhouse,
        CombinationTypesEnum.street,
        CombinationTypesEnum.triple,
        CombinationTypesEnum.double,
        CombinationTypesEnum.pair,
        CombinationTypesEnum.kicker,
      ];

      let combinationFound = false;

      resultTypes.forEach((resType) => {
        const combination = combinations[resType];

        if (combinationFound) return;

        if (combination.isThere) {
          switch (resType) {
            case CombinationTypesEnum.poker:
              this.result = `покер с номиналом ${combination.nominal}`;
              break;
            case CombinationTypesEnum.quadriple:
              this.result = `каре с номиналом ${combination.nominal}`;
              break;
            case CombinationTypesEnum.fullhouse:
              this.result = `фулл-хаус c тройкой из ${combination.nominal.toString()[0]} и парой из ${combination.nominal.toString()[1]}`;
              break;
            case CombinationTypesEnum.street:
              this.result = `стрит с кикером ${combination.nominal}`;
              break;
            case CombinationTypesEnum.triple:
              this.result = `тройка из ${combination.nominal}`;
              break;
            case CombinationTypesEnum.double:
              this.result = `две пары из ${combination.nominal.toString()[0]} и ${combination.nominal.toString()[1]}`;
              break;
            case CombinationTypesEnum.pair:
              this.result = `пара из ${combination.nominal}`;
              break;
            case CombinationTypesEnum.kicker:
              this.result = 'кикер с номиналом ${combination.nominal}`';
              break;
          }

          combinationFound = true;
        }

        return;
      });
    }

    checkCombinations();
    setResult();

    console.log('Комбинации: ', combinations);
  }
}
