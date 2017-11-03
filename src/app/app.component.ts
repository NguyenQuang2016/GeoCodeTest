import { Component, OnInit} from '@angular/core';
import {} from '@types/googlemaps';
let _this;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mapInstance: google.maps.Map;
  title = 'app';
  address = '';
  fstatus = false;
  geocodeRequest: google.maps.GeocoderRequest;
  isGeocodeFinished = false;
  xhr: XMLHttpRequest;
  ngOnInit() {
    console.log(`OnInit`);
    /* can not use 'this' pointer when function call paramenter function
    please use _this. fuck of typeScript/JavaScript */
    _this = this;
    this.waitGoogleApisLoaded();
  }
  initNativeJsGoogleMap(): void {
    const opt: google.maps.MapOptions = {
      center: {lat: 10.729190, lng: 106.721715}, // this lat/lng should be load from datatbase
      zoom: 10
    };
    const mapDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('ggmap');
    this.mapInstance = new google.maps.Map(mapDiv, opt);
  }

  async waitGoogleApisLoaded(): Promise<void> {
    await this.delay(500);
    this.initNativeJsGoogleMap();
  }

  delay(milliseconds: number): Promise<number> {
    return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
  }
  geocode_click() {
    let address = (<HTMLInputElement>document.getElementById('addr')).value + ', Quan 7, Ho Chi Minh';
    address = address.replace(/ /g, '+');

    const textSearchReq: google.maps.places.TextSearchRequest = {
      query: address,
    };
    const service = new google.maps.places.PlacesService(this.mapInstance);
    service.textSearch(textSearchReq, (results, status) => {
      this.geocodeCallback(results, address);
    });

  }
  geocodeCallback(results: google.maps.places.PlaceResult[], address: string) {
    if (results.length !== 0) {
      console.log(results);

      const markerLatLng: google.maps.LatLngLiteral = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      const markersOpt: google.maps.MarkerOptions = {
        draggable: false,
        position: markerLatLng,
        animation: google.maps.Animation.BOUNCE,
      };
      const place_marker = new google.maps.Marker( markersOpt);
      place_marker.setMap(this.mapInstance);
      this.mapInstance.setCenter(markerLatLng);
      this.mapInstance.setZoom(15);
    } else {
      const wp = address.indexOf('+');
      address = address.slice(wp + 1, address.length);

      const textSearchReq: google.maps.places.TextSearchRequest = {
        query: address,
      };
      const service = new google.maps.places.PlacesService(this.mapInstance);
      service.textSearch(textSearchReq, (_results, status) => {
        this.geocodeCallback(_results, address);
      });
    }
  }
}
