import { IMoveDirectionItem } from './../../models/location.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILocationModel } from 'src/app/models/location.model';
import { MapService } from 'src/app/services/map.service';
import { getChipsText } from '../helpers/common.helper';

@Component({
  selector: 'app-map',
  styleUrls: ['map.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map">
      <div class="map__location">
        <span class="north-sign jost semibold">С</span>
        <span class="west-sign jost semibold">З</span>
        <span class="south-sign jost semibold">Ю</span>
        <span class="east-sign jost semibold">В</span>

        <div class="locations">
          <div *ngFor="let location of (locations$ | async)" class="locations__item" [ngClass]="{'current': (currentLocation$ | async)?.id === location.id}">
            <img *ngIf="location.isKnown === true" [src]="location.tileSrc">
          </div>
        </div>
      </div>
      <div class="map__description">
        <div class="map__description__header jost subheader bold">Описание локации</div>
        <div class="map__description__text jost">
          {{ (this.currentLocation$ | async)?.description }}
        </div>
        <div class="map__description__directions jost" [innerHTML]="currentLocationDirectionNames"></div>
        <div class="map__description__objects jost" [innerHTML]="currentLocationObjectNames"></div> 
      </div>
    </div>
  `
})
export class MapComponent {
  currentLocation$!: BehaviorSubject<ILocationModel>;
  locations$!: BehaviorSubject<ILocationModel[]>;

  currentLocationObjectNames: string = '';
  currentLocationDirectionNames: string = '';

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.currentLocation$ = this.mapService.getCurrentLocation();
    this.locations$ = this.mapService.getLocations();

    this.currentLocation$.subscribe((location) => {
      if (!location) return;

      const locationObjectNames: string[] = location.objects.map((object) => object.name);
      this.currentLocationObjectNames = `Объекты для взаимодействия: ${getChipsText(locationObjectNames, 'noun')}`;

      const locationDirectionNames: string[] = [];
      Object.values(location.moveDirections).forEach((direction: IMoveDirectionItem) => {
        if (direction) {
          locationDirectionNames.push(direction.name);
        }
      });
      this.currentLocationDirectionNames = `Направления для пережвижения: ${getChipsText(locationDirectionNames, 'direction')}`;
    });
  }
}
