import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PodcastLocation } from '../../map/models';

@Component({
  selector: 'pm-location-list',
  templateUrl: './location-list.component.html',
  styles: [ 'li { padding-right: 5px }']
})
export class LocationListComponent {

  @Input()
  locations$: Observable<PodcastLocation[]>;

  @Input()
  limit = 99;

  @Input()
  locations: PodcastLocation[];

  constructor() { }

}
