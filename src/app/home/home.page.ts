import { NavController } from "@ionic/angular";
import { IonicNativePlugin } from '@ionic-native/core'
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Component, ElementRef, ViewChild } from "@angular/core";
import { TestBed } from "@angular/core/testing";

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  options : GeolocationOptions;
  currentPos : Geoposition;
  @ViewChild('map') mapElement: ElementRef;
   map: any;

   places : Array<any> ; 
  constructor(public navCtrl: NavController,
    private geolocation : Geolocation) {}
    
    ionViewDidEnter(){
      this.getUserPosition();
  } 
  service1Spy = TestBed.get(Service1);

  getRestaurants(latLng)
{
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        radius : 8047 ,
        types: ["restaurant"]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);    
            }else
            {
                reject(status);
            }

        }); 
    });

}

createMarker(place)
{
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location
    });   
} 
  
getUserPosition(){
  this.options = {
  enableHighAccuracy : false
  };
 this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

      this.currentPos = pos;     

      console.log(pos);
      this.addMap(pos.coords.latitude,pos.coords.longitude);

  },(err : PositionError)=>{
      console.log("error : " + err.message);
  ;
  })
}
addMap(lat,long){

  let latLng = new google.maps.LatLng(lat, long);

  let mapOptions = {
  center: latLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  this.getRestaurants(latLng).then((results : Array<any>)=>{
      this.places = results;
      for(let i = 0 ;i < results.length ; i++)
      {
          this.createMarker(results[i]);
      }
  },(status)=>console.log(status));

  this.addMarker();

}

addMarker(){

  let marker = new google.maps.Marker({
  map: this.map,
  animation: google.maps.Animation.DROP,
  position: this.map.getCenter()
  });

  let content = "<p>This is your current position !</p>";          
  let infoWindow = new google.maps.InfoWindow({
  content: content
  });

  google.maps.event.addListener(marker, 'click', () => {
  infoWindow.open(this.map, marker);
  });

}
}

function Service1(Service1: any) {
  throw new Error("Function not implemented.");
}

