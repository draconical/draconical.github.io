import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { ILocationModel } from '../models/location.model';
import { ConsoleService } from './console.service';
import { IMessageSourceEnum } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private currentLocation$: BehaviorSubject<ILocationModel> = new BehaviorSubject<ILocationModel>({ id: 0, isKnown: false, tileSrc: '', description: '', objects: [] });
  private locations: ILocationModel[] = [
    {
      id: 1, isKnown: false, tileSrc: '../../../assets/tiles/room1_gate.png',
      description: 'Каменная арка, обвитая плющём; сразу за ней виднеется лестница, ведущая вниз - в склеп.',
      objects: [
        {
          id: 4,
          name: 'плющ',
          actions: [
            {
              command: 'осмотреть',
              func: () => {
                this.consoleService.addNewMessage({
                  source: IMessageSourceEnum.System,
                  value: `Это плющ, под листьями которого скрывается множество плотных ветвей, перекрывающих вход внутрь.`
                })
              }
            }
          ]
        },
      ]
    },
    {
      id: 2, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_hor.png',
      description: 'Узкий коридор. Ничего особенного?..',
      objects: []
    },
    {
      id: 3, isKnown: false, tileSrc: '../../../assets/tiles/room2_fountain.png',
      description: 'Просторная комната, в центре которой расположен фонтан.',
      objects: []
    },

    {
      id: 4, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_ver.png',
      description: 'Скрытый путь, ведущий обратно ко входу.',
      objects: []
    },
    {
      id: 5, isKnown: false, tileSrc: '',
      description: '',
      objects: []
    },
    {
      id: 6, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_ver.png',
      description: 'Короткий коридор заканчивается массивной деревянной дверью с металлическими ставнями.',
      objects: []
    },

    {
      id: 7, isKnown: false, tileSrc: '../../../assets/tiles/room4_chest.png',
      description: 'Красиво украшенная гробница с особо обработанным саркофагом прямо посередине.',
      objects: []
    },
    {
      id: 8, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_hor.png',
      description: 'И снова коридор... И лишь гулкий ветер слышен здесь.',
      objects: []
    },
    {
      id: 9, isKnown: false, tileSrc: '../../../assets/tiles/room3_enemy.png',
      description: 'Неболшой зал, увешанный истрёпанными флагами. В уголке виднеется стол, на котором лежит всякая утварь.',
      objects: []
    },
  ];
  private locations$: BehaviorSubject<ILocationModel[]> = new BehaviorSubject<ILocationModel[]>(this.locations);

  constructor(
    private consoleService: ConsoleService,
  ) { }

  private discoverLocation(id: number): void {
    this.locations[id - 1].isKnown = true;
    this.locations$.next(this.locations);
  }

  getLocations(): BehaviorSubject<ILocationModel[]> {
    return this.locations$;
  }

  getCurrentLocation(): BehaviorSubject<ILocationModel> {
    return this.currentLocation$;
  }

  setCurrentLocation(id: number): void {
    this.discoverLocation(id);
    this.currentLocation$.next(this.locations[id - 1]);
  }
}