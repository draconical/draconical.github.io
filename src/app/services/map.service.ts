import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { ILocationModel, IMoveDirectionsAltEnum, IMoveDirectionsEnum } from '../models/location.model';
import { ConsoleService } from './console.service';
import { ObjectService } from './object.service';
import { IMessageSourceEnum } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private currentLocation$: BehaviorSubject<ILocationModel> = new BehaviorSubject<ILocationModel>({
    id: 0, isKnown: false, tileSrc: '', description: '', objects: [], moveDirections: { north: null, east: null, south: null, west: null }
  });
  private locations: ILocationModel[] = [
    {
      id: 1, isKnown: false, tileSrc: '../../../assets/tiles/room1_gate.png',
      description: 'Каменная арка, обвитая плющём; сразу за ней виднеется лестница, ведущая вниз - в склеп.',
      objects: [
        this.objectService.getObject(4),
      ],
      moveDirections: {
        north: null,
        east: null,
        south: null,
        west: null
      }
    },
    {
      id: 2, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_right.png',
      description: 'Узкий коридор. Ничего особенного?..',
      objects: [],
      moveDirections: {
        north: null,
        east: {
          name: IMoveDirectionsAltEnum.east,
          func: () => { this.setCurrentLocation(3) }
        },
        south: null,
        west: {
          name: IMoveDirectionsAltEnum.west,
          func: () => { this.setCurrentLocation(1) }
        }
      }
    },
    {
      id: 3, isKnown: false, tileSrc: '../../../assets/tiles/room2_fountain.png',
      description: 'Просторная комната, в центре которой расположен фонтан.',
      objects: [
        this.objectService.getObject(5),
      ],
      moveDirections: {
        north: null,
        east: null,
        south: {
          name: IMoveDirectionsAltEnum.south,
          func: () => { this.setCurrentLocation(6) }
        },
        west: {
          name: IMoveDirectionsAltEnum.west,
          func: () => { this.setCurrentLocation(2) }
        }
      }
    },

    {
      id: 4, isKnown: false, tileSrc: '',
      description: '',
      objects: [],
      moveDirections: {
        north: null,
        east: null,
        south: null,
        west: null
      }
    },
    {
      id: 5, isKnown: false, tileSrc: '',
      description: '',
      objects: [],
      moveDirections: {
        north: null,
        east: null,
        south: null,
        west: null
      }
    },
    {
      id: 6, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_down.png',
      description: 'Короткий коридор заканчивается массивной деревянной дверью с металлическими ставнями.',
      objects: [
        this.objectService.getObject(6),
      ],
      moveDirections: {
        north: {
          name: IMoveDirectionsAltEnum.north,
          func: () => { this.setCurrentLocation(3) }
        },
        east: null,
        south: {
          name: IMoveDirectionsAltEnum.south,
          func: () => { this.setCurrentLocation(9) }
        },
        west: null
      }
    },

    {
      id: 7, isKnown: false, tileSrc: '../../../assets/tiles/room4_chest.png',
      description: 'Красиво украшенная гробница с особо обработанным саркофагом прямо посередине.',
      objects: [
        this.objectService.getObject(8),
      ],
      moveDirections: {
        north: null,
        east: {
          name: IMoveDirectionsAltEnum.east,
          func: () => { this.setCurrentLocation(8) }
        },
        south: null,
        west: null
      }
    },
    {
      id: 8, isKnown: false, tileSrc: '../../../assets/tiles/tile1_pass_left.png',
      description: 'И снова коридор... И лишь гулкий ветер слышен здесь.',
      objects: [],
      moveDirections: {
        north: null,
        east: null,
        south: null,
        west: {
          name: IMoveDirectionsAltEnum.west,
          func: () => { this.setCurrentLocation(7) }
        }
      }
    },
    {
      id: 9, isKnown: false, tileSrc: '../../../assets/tiles/room3_enemy.png',
      description: 'Неболшой зал, увешанный истрёпанными флагами. В уголке виднеется стол, на котором лежит всякая утварь.',
      objects: [
        this.objectService.getObject(7),
      ],
      moveDirections: {
        north: null,
        east: null,
        south: null,
        west: null
      }
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

  addItem(id: number, dropActionNeeded: boolean = true, locationId?: number): void {
    const item = this.objectService.getObject(id, dropActionNeeded ? 'drop' : undefined);

    const alteredLocation = locationId !== undefined ? this.locations[locationId - 1] : this.currentLocation$.getValue();
    alteredLocation.objects.push(item);

    this.updateAllLocations(alteredLocation);
  }

  removeObject(id: number): void {
    const itemIndex = this.currentLocation$.getValue().objects.findIndex((item) => item.id === id);

    const alteredLocation = this.currentLocation$.getValue();
    alteredLocation.objects.splice(itemIndex, 1);

    this.updateAllLocations(alteredLocation);
  }

  modifyMoveDirection(direction: IMoveDirectionsEnum, modType: 'unlock' | 'lock', moveToLocationId: number, locationId?: number): void {
    const alteredLocation = locationId !== undefined ? this.locations[locationId - 1] : this.currentLocation$.getValue();
    if (modType === 'lock') {
      alteredLocation.moveDirections[direction] = null;
    } else {
      alteredLocation.moveDirections[direction] = {
        name: IMoveDirectionsAltEnum[direction],
        func: () => {
          this.setCurrentLocation(moveToLocationId)
        }
      }
    }

    this.updateAllLocations(alteredLocation);
  }

  checkObjectHp(objectId: number): number {
    const alteredLocation = this.currentLocation$.getValue();
    const object = alteredLocation.objects.find((object) => object.id === objectId);

    return object?.hp ?? 0;
  }

  modifyObjectHp(enemyId: number, amount: number): void {
    const alteredLocation = this.currentLocation$.getValue();
    const object = alteredLocation.objects.find((object) => object.id === enemyId);

    if (object?.hp !== undefined) {
      object.hp += amount;
    }
  }
}