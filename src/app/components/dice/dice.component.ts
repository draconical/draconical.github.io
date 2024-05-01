import { ClashService } from './../../services/clash.service';
import { IDiceModel } from '../../models/dice.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICombinationsModel, ICombinationsEnum, ICombinationTypesEnum } from 'src/app/models/combination.model';
import { IAdversariesEnum } from 'src/app/services/clash.service';

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
        Результат {{ adversaryToken === 'player' ? 'игрока' : 'оппонента' }}: {{ result }}
    </div>
  `
})
export class DiceComponent {
  @Input() adversaryToken!: IAdversariesEnum;

  dices!: IDiceModel[];

  rerollLimit: number = 2;
  currentReroll: number[] = [];
  rerollAlreadyDone: boolean = false;

  result = '';

  constructor(private clashService: ClashService) { }

  ngOnInit(): void { }

  checkDiceForReroll(dice: IDiceModel): void {
    if (dice.checkedForReroll === false) {
      if (this.currentReroll.length >= this.rerollLimit || this.rerollAlreadyDone) return;
    }

    dice.checkedForReroll = !dice.checkedForReroll;
    this._calculateCurrentReroll();
  }

  generateDices(): void {
    const newSet: IDiceModel[] = [];

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

  private _createDiceInstance(): IDiceModel {
    return {
      value: this._randomInt(1, 5),
      checkedForReroll: false
    }
  }

  private _sortDices(): void {
    this.dices.sort((a, b) => a.value - b.value);
  }

  private _setClashResult(combinations: ICombinationsModel): void {
    let nominal: number = 0;

    const kicker: number = combinations.kicker.nominal;
    const keys: ICombinationTypesEnum[] = [
      ICombinationTypesEnum.pair,
      ICombinationTypesEnum.double,
      ICombinationTypesEnum.triple,
      ICombinationTypesEnum.street,
      ICombinationTypesEnum.fullhouse,
      ICombinationTypesEnum.quadriple,
      ICombinationTypesEnum.poker,
    ];

    keys.forEach((key) => {
      const value = combinations[key];
      if (!value.isThere) return;

      nominal = Number(value.base.toString() + '.' + value.nominal.toString());
    })

    const finalResult = combinations.kicker.isThere ? Number(nominal.toString() + kicker.toString()) : nominal;

    console.log(`Комбинация ${this.adversaryToken === 'player' ? 'игрока' : 'оппонента'}:`, finalResult);
    this.clashService.setRollValue(this.adversaryToken, finalResult);
  }

  private _calcCombination(): void {
    const nums = [...this.dices]
      .sort((a, b) => a.value - b.value)
      .map((dice) => dice.value);

    const combinations: ICombinationsModel = {
      kicker: { isThere: false, base: ICombinationsEnum.Kicker, nominal: 0 },
      pair: { isThere: false, base: ICombinationsEnum.Pair, nominal: 0 },
      double: { isThere: false, base: ICombinationsEnum.Double, nominal: 0 },
      triple: { isThere: false, base: ICombinationsEnum.Triple, nominal: 0 },
      street: { isThere: false, base: ICombinationsEnum.Street, nominal: 0 },
      fullhouse: { isThere: false, base: ICombinationsEnum.Fullhouse, nominal: 0 },
      quadriple: { isThere: false, base: ICombinationsEnum.Quadriple, nominal: 0 },
      poker: { isThere: false, base: ICombinationsEnum.Poker, nominal: 0 }
    }

    const setCombinationValue = (type: ICombinationTypesEnum, nominal: number) => {
      combinations[type].isThere = true;
      combinations[type].nominal = nominal;
    }

    const checkCombinations = () => {
      const isStreet = nums.reduce((prev, curr) => {
        return (curr === prev + 1) ? curr : 0;
      });

      if (isStreet !== 0) {
        setCombinationValue(ICombinationTypesEnum.street, isStreet);
        return;
      }

      for (let i = 1; i <= 6; i++) {
        const filtered = nums.filter((num) => num === i);

        switch (filtered.length) {
          case 1:
            setCombinationValue(ICombinationTypesEnum.kicker, i);
            break;
          case 2:
            if (!combinations.pair.isThere) {
              setCombinationValue(ICombinationTypesEnum.pair, i);
            } else {
              setCombinationValue(ICombinationTypesEnum.double, Number(`${i}${combinations.pair.nominal}`));
            }
            break;
          case 3:
            setCombinationValue(ICombinationTypesEnum.triple, i);
            break;
          case 4:
            setCombinationValue(ICombinationTypesEnum.quadriple, i);
            break;
          case 5:
            setCombinationValue(ICombinationTypesEnum.poker, i);
            break;
          default:
            break;
        }

        if (combinations.triple.isThere && combinations.pair.isThere) {
          setCombinationValue(ICombinationTypesEnum.fullhouse, Number(`${combinations.triple.nominal}${combinations.pair.nominal}`));
        }
      }
    }

    const setResult = () => {
      const resultTypes: ICombinationTypesEnum[] = [
        ICombinationTypesEnum.poker,
        ICombinationTypesEnum.quadriple,
        ICombinationTypesEnum.fullhouse,
        ICombinationTypesEnum.street,
        ICombinationTypesEnum.triple,
        ICombinationTypesEnum.double,
        ICombinationTypesEnum.pair,
        ICombinationTypesEnum.kicker,
      ];

      let combinationFound = false;

      resultTypes.forEach((resType) => {
        const combination = combinations[resType];

        if (combinationFound) return;

        if (combination.isThere) {
          switch (resType) {
            case ICombinationTypesEnum.poker:
              this.result = `покер с номиналом ${combination.nominal}`;
              break;
            case ICombinationTypesEnum.quadriple:
              this.result = `каре с номиналом ${combination.nominal}`;
              break;
            case ICombinationTypesEnum.fullhouse:
              this.result = `фулл-хаус c тройкой из ${combination.nominal.toString()[0]} и парой из ${combination.nominal.toString()[1]}`;
              break;
            case ICombinationTypesEnum.street:
              this.result = `стрит с кикером ${combination.nominal}`;
              break;
            case ICombinationTypesEnum.triple:
              this.result = `тройка из ${combination.nominal}`;
              break;
            case ICombinationTypesEnum.double:
              this.result = `две пары из ${combination.nominal.toString()[0]} и ${combination.nominal.toString()[1]}`;
              break;
            case ICombinationTypesEnum.pair:
              this.result = `пара из ${combination.nominal}`;
              break;
            case ICombinationTypesEnum.kicker:
              this.result = 'кикер с номиналом ${combination.nominal}`';
              break;
          }

          combinationFound = true;
        }
      });
    }

    checkCombinations();
    setResult();
    this._setClashResult(combinations);
  }
}
