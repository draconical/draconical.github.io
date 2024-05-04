import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { ILocationModel } from '../models/location.model';
import { ConsoleService } from './console.service';
import { ObjectService } from './object.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private currentLocation$: BehaviorSubject<ILocationModel> = new BehaviorSubject<ILocationModel>({ id: 0, isKnown: false, tileSrc: '', description: '', objects: [], moveDirections: { north: false, east: false, south: false, west: false } });
  private locations: ILocationModel[] = [
    {
      id: 1, isKnown: false, tileSrc: '../../../assets/tiles/room1_gate.png',
      description: 'Каменная арка, обвитая плющём; сразу за ней виднеется лестница, ведущая вниз - в склеп.',
      objects: [
        this.objectService.getItem(4),
      ],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
    {
      id: 2, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_hor.png',
      description: 'Узкий коридор. Ничего особенного?..',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
    {
      id: 3, isKnown: false, tileSrc: '../../../assets/tiles/room2_fountain.png',
      description: 'Просторная комната, в центре которой расположен фонтан.',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },

    {
      id: 4, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_ver.png',
      description: 'Скрытый путь, ведущий обратно ко входу.',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
    {
      id: 5, isKnown: false, tileSrc: '',
      description: '',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
    {
      id: 6, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_ver.png',
      description: 'Короткий коридор заканчивается массивной деревянной дверью с металлическими ставнями.',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },

    {
      id: 7, isKnown: false, tileSrc: '../../../assets/tiles/room4_chest.png',
      description: 'Красиво украшенная гробница с особо обработанным саркофагом прямо посередине.',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
    {
      id: 8, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_hor.png',
      description: 'И снова коридор... И лишь гулкий ветер слышен здесь.',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
    {
      id: 9, isKnown: false, tileSrc: '../../../assets/tiles/room3_enemy.png',
      description: 'Неболшой зал, увешанный истрёпанными флагами. В уголке виднеется стол, на котором лежит всякая утварь.',
      objects: [],
      moveDirections: { north: false, east: false, south: false, west: false }
    },
  ];
  private locations$: BehaviorSubject<ILocationModel[]> = new BehaviorSubject<ILocationModel[]>(this.locations);

  constructor(
    private consoleService: ConsoleService,
    private objectService: ObjectService
  ) { }

  private discoverLocation(id: number): void {
    this.locations[id - 1].isKnown = true;
    this.locations$.next(this.locations);
  }

  private updateCurrentLocation(location: ILocationModel) {
    this.currentLocation$.next(location);
  }

  private updateLocation(location: ILocationModel): void {
    this.locations[location.id - 1] = location;
    this.locations$.next(this.locations);
  }

  private updateAllLocations(location: ILocationModel): void {
    this.updateLocation(location);
    this.updateCurrentLocation(location);
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

  addItem(id: number): void {
    const item = this.objectService.getItem(id);

    const alteredLocation = this.currentLocation$.getValue();
    alteredLocation.objects.push(item);

    this.updateAllLocations(alteredLocation);
  }

  removeItem(id: number): void {
    const itemIndex = this.currentLocation$.getValue().objects.findIndex((item) => item.id === id);

    const alteredLocation = this.currentLocation$.getValue();
    alteredLocation.objects.splice(itemIndex, 1);

    this.updateAllLocations(alteredLocation);
  }

  modifyMoveDirection(direction: 'north' | 'east' | 'south' | 'west', modifyType: 'unlock' | 'lock'): void {
    const alteredLocation = this.currentLocation$.getValue();
    alteredLocation.moveDirections[direction] = modifyType === 'lock' ? false : true;

    this.updateAllLocations(alteredLocation);
  }
}