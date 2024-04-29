import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-map',
  styleUrls: ['map.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map">
      <div class="map__location">

      </div>
      <div class="map__description">
        <div class="map__description__header jost subheader bold">Описание локации</div>
        <div class="map__description__text jost">
          Здесь будет описание локации.
        </div>
      </div>
    </div>
  `
})
export class MapComponent {
  constructor() { }

  ngOnInit(): void { }
}
