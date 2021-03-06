import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { AgmMap } from '@agm/core';
import { DomSanitizer } from '@angular/platform-browser';
import { mapStyle } from './podmap.mapstyle';
import { MatIconRegistry } from '@angular/material';
import { MapService } from '../services/map.service';
import * as firebase from 'firebase/app';
import { PodcastLocation, MetaCounts } from './models';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

declare let google: any;
declare let require: any;

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MapComponent implements OnInit, OnDestroy {

  geoPoint: firebase.firestore.GeoPoint;
  zoom = 5;
  mapStyle = mapStyle;
  showAd = true;
  markers$: Observable<PodcastLocation[]>;
  counts$: Observable<MetaCounts>;
  icon;

  @ViewChild(AgmMap) agmMap: AgmMap;

  constructor(
    private mapService: MapService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    afs: AngularFirestore,
    private router: Router
  ) {
    // icons
    // iconRegistry.addSvgIcon('my-location', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_my_location_black_24px.svg'));
    const iconPath = '../../assets/icons/';
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_close_black_24px.svg'));
    iconRegistry.addSvgIcon('location', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_location_on_black_24px.svg'));
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_search_black_24px.svg'));
    iconRegistry.addSvgIcon('done', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_done_black_24px.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic-add-24px.svg'));
    iconRegistry.addSvgIcon('podmap', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'podmap-icon.svg'));
    // markers
    this.markers$ = afs.collection<PodcastLocation>('locations').valueChanges();
    this.icon = {
      url: require('../../assets/img/podmap-marker.png'),
      scaledSize: {
        height: 23,
        width: 30
      }
    };
    this.counts$ = afs.doc<MetaCounts>('meta/counts').valueChanges();

    // afs.collection('podcasts').snapshotChanges().subscribe(data => console.log('podcast data', data));
    // afs.collection('locations').snapshotChanges().subscribe(data => console.log('podcast data', data));
  }

  ngOnInit() {
    this.mapService.geoPoint$.subscribe(pos => this.geoPoint = pos);
    this.mapService.zoom$.subscribe(zoom => this.zoom = zoom);
    // place details service
    this.agmMap.mapReady.subscribe(map => {
      this.mapService.placesService = new google.maps.places.PlacesService(map);
      this.agmMap.mapReady.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.mapService.geoPoint$.unsubscribe();
    this.mapService.zoom$.unsubscribe();
  }

  markerClick(marker: PodcastLocation) {
    this.router.navigate(['location', marker.placeId]);
  }

}
