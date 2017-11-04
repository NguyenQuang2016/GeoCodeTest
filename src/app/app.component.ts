import { Component, OnInit} from '@angular/core';
import {} from '@types/googlemaps';
let _this;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cityField = '';
  districtField = '';
  wardField = '';
  address = '';
  mapInstance: google.maps.Map;
  title = 'app';
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
    this.autoFill();
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


  async autoFill(): Promise<void> {
    const latlng = await this.getLocation();
    console.log(latlng);

    const service = new google.maps.Geocoder();
    service.geocode({location: latlng}, this.autoFillCallback);
  }
  autoFillCallback(results, status) {
    console.log(results[0]);
    const formatted_address: string =  results[0].formatted_address;
    const formatted_address_arr = formatted_address.split(', ');
    const txt_city: HTMLInputElement = <HTMLInputElement>document.getElementById('txt_city');
    const txt_dicstict: HTMLInputElement = <HTMLInputElement>document.getElementById('txt_dicstict');
    const txt_ward: HTMLInputElement = <HTMLInputElement>document.getElementById('txt_ward');
    const txt_address: HTMLInputElement = <HTMLInputElement>document.getElementById('txt_address');


    try {
      txt_city.value = formatted_address_arr[formatted_address_arr.length - 2];
      _this.cityField = formatted_address_arr[formatted_address_arr.length - 2];
      txt_dicstict.value = formatted_address_arr[formatted_address_arr.length - 3];
      _this.districtField = formatted_address_arr[formatted_address_arr.length - 3];
      txt_ward.value = formatted_address_arr[formatted_address_arr.length - 4];
      _this.wardField = formatted_address_arr[formatted_address_arr.length - 4];
      txt_address.value = formatted_address_arr[formatted_address_arr.length - 5];
      _this.address = formatted_address_arr[formatted_address_arr.length - 5];
    } catch (ex) {
      console.log(ex);
    }

    console.log('1', this.address);
  }
  async geocode_click(): Promise<void> {
    console.log('2', this.address);
    let address = this.address + ', ' +
                  this.wardField + ', ' +
                  this.districtField + ', ' +
                  this.cityField;

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
  async getLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise<google.maps.LatLngLiteral> ( resolve => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const markerLatLng: google.maps.LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.mapInstance.setCenter(markerLatLng);
          const markersOpt: google.maps.MarkerOptions = {
            draggable: false,
            position: markerLatLng,
          };
          const user_marker = new google.maps.Marker( markersOpt);
          user_marker.setMap(this.mapInstance);
          this.mapInstance.setZoom(15);
          resolve(markerLatLng);
        });
      }
    });
  }
  onCityChange(event) {
    this.cityField = event.target.value;
    console.log(this.cityField);
  }
  onDistrictChange(event) {
    this.districtField = event.target.value;
    console.log(this.districtField);
  }
  onWardChange(event) {
    this.wardField = event.target.value;
    console.log(this.wardField);
  }
  onAddressChange(event) {
    this.address = event.target.value;
    console.log(this.address);
  }
}
