import { Component, OnInit } from '@angular/core';
import {Map,tileLayer,marker} from 'leaflet';
import {Router,NavigationExtras} from '@angular/router';
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

@Component({
  selector: 'app-pick-location',
  templateUrl: './pick-location.page.html',
  styleUrls: ['./pick-location.page.scss'],
})
export class PickLocationPage  {
  map: Map;
  address: string[];

  MyMarker: any;
  constructor(private geocoder: NativeGeocoder, private router: Router) {}  
 
  ionViewDidEnter(){
    this.loadMap();
  }
 
  loadMap(){
this.map = new Map("mapId").setView([48.1075,17.1118], 16); //location (latitude longitude,zoom)
  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(this.map); //  openstreetmap tile
  }

  locateMyPosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      this.MyMarker = marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.MyMarker.bindPopup("You are located here!").openPopup();
      this.getAddress(e.latitude, e.longitude); 
   
      this.MyMarker.on("dragend", () => {
        const position = this.MyMarker.getLatLng();
        this.getAddress(position.lat, position.lng);
      });
    });
  }
    getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geocoder.reverseGeocode(lat, long, options).then(results => {
    this.address = Object.values(results[0]).reverse();
      
    });
  }

  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
    state: {
    pickupLocation: this.address
    }
    };
    this.router.navigate(["home"], navigationextras);
  }

  goBack(){
    this.router.navigate(["home"]);
  }
}