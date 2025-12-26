import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  constructor(private router: Router) { }

  // // Entry point
  // getStarted() {
  //   const storedCity = sessionStorage.getItem('location');

  //   if (storedCity) {
  //     this.navigateWithLocation(storedCity);
  //   } else {
  //     this.askForLocation();
  //   }
  // }

  // // Ask browser for location
  // askForLocation() {
  //   if (!navigator.geolocation) {
  //     console.error('Geolocation not supported');
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const lat = position.coords.latitude;
  //       const lon = position.coords.longitude;

  //       this.getCityFromCoordinates(lat, lon);
  //     },
  //     (error) => {
  //       console.error('Location permission denied', error);
  //       alert('Please allow location access to continue');
  //     }
  //   );
  // }

  // // Reverse geocoding → City name
  // getCityFromCoordinates(lat: number, lon: number) {
  //   const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  //   fetch(url)
  //     .then(res => res.json())
  //     .then(data => {
  //       const address = data.address;

  //       const city =
  //         address.city ||
  //         address.town ||
  //         address.village ||
  //         address.state;

  //       if (city) {
  //         sessionStorage.setItem('location', city);
  //         this.navigateWithLocation(city);
  //       } else {
  //         console.error('City not found');
  //       }
  //     })
  //     .catch(err => {
  //       console.error('Reverse geocoding failed', err);
  //     });
  // }

  // // Navigate with query param
  // navigateWithLocation(city: string) {
  //   this.router.navigate([], {
  //     queryParams: { ref: city },
  //     queryParamsHandling: 'merge'
  //   });
  // }


  getStarted() {

    alert('Get Started clicked!');
  }

}
