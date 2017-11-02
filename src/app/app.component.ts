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
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      this.geocodeCallback(xhr.response, address);
    };
    xhr.onerror = function() {
      console.log('Woops, there was an error making the request.');
    };
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                  address + '&key=AIzaSyCkasIhnDT8JXp8mVMVO7c2AXYfZpUF7dU';
    xhr.open('GET', url, true);
    xhr.send();
  }
  geocodeCallback(response: any, address: string) {
    let resp = JSON.parse(response);
    if (resp.results.length !== 0) {
      console.log(resp);
    } else {
      const wp = address.indexOf('+');
      address = address.slice(wp + 1, address.length);

      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const len = xhr.response.lenght;
        this.geocodeCallback(xhr.response, address);
      };
      xhr.onerror = function() {
        console.log('Woops, there was an error making the request.');
      };
      const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                address + '&key=AIzaSyCkasIhnDT8JXp8mVMVO7c2AXYfZpUF7dU';
      xhr.open('GET', url, true);
      xhr.send();
    }
  }
}
