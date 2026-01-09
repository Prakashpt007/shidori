import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/internal/operators/map';
import { GenericHttpService } from '../../services/generic-http.service';
import { Store } from '@ngrx/store';
import { AppState, setUserLocation } from '../../utility/store/store.reducer';
import { selectUserLocation } from '../../utility/store/store.selectors';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
	readonly locationConfirmation = viewChild.required<ElementRef>("locationConfirmation");
	private modalService = inject(NgbModal);
	http = inject(HttpClient);
	store = inject(Store<AppState>);

	listApi = '/assets/jsons/locations.json';
	storeLocationApi = 'save-location';
	selectedCity: any | null = null;

	toastr = inject(ToastrService);
	genericHttp = inject(GenericHttpService);

	inputSearchCity = '';
	searchCity = ''; // final selected string
	cityList = signal<any[]>([]);
	showResults = signal<boolean>(false);
	userLocation$ = this.store.select(selectUserLocation);

	processToStore = signal<boolean>(false);

	private suppressBlurClose = false;
	currentLocationLabel = signal<string>('');

	constructor() {
		this.userLocation$.subscribe(loc => {
			if (loc) {
				this.currentLocationLabel.set(`${loc.city}, ${loc.state} - ${loc.pincode}`);
			} else {
				this.currentLocationLabel.set('');
			}
		});
	}



	ngOnInit() {
		// 1) from NgRx (if already in store)
		this.userLocation$.subscribe(loc => {
			if (loc) {
				const label = `${loc.city}, ${loc.state} - ${loc.pincode}`;
				this.searchCity = label;
				this.inputSearchCity = label;
			}
		});

		// 2) fallback from localStorage/sessionStorage
		if (!this.searchCity) {
			const raw =
				localStorage.getItem('user_location') ??
				sessionStorage.getItem('user_location');
			if (raw) {
				try {
					const saved = JSON.parse(raw);
					const label = `${saved.city}, ${saved.state} - ${saved.pincode}`;
					this.searchCity = label;
					this.inputSearchCity = label;

					this.store.dispatch(
						setUserLocation({
							value: {
								city: saved.city,
								state: saved.state,
								pincode: +saved.pincode,
								detection_method: saved.detection_method ?? 'manual',
							},
						})
					);
				} catch { }
			}
		}
	}

	onSearchChange(searchTxt: string): void {
		this.inputSearchCity = searchTxt;

		if (searchTxt.length > 2) {
			this.getCities(searchTxt);
		} else {
			this.cityList.set([]);
			this.showResults.set(false);
			if (searchTxt.length === 0) {
				this.searchCity = '';
			}
		}
	}

	onInputFocus(): void {
		if (this.cityList().length) {
			this.showResults.set(true);
		}
	}

	onInputBlur(event: FocusEvent): void {
		if (this.suppressBlurClose) {
			// Click on result; keep open until click handler runs
			return;
		}
		this.showResults.set(false);
	}

	onResultMouseDown(event: MouseEvent): void {
		// prevent blur from closing the list before click
		this.suppressBlurClose = true;
		event.preventDefault();
	}

	getCities(searchTxt: string): void {
		const url = this.listApi + '?search=' + encodeURIComponent(searchTxt);

		this.genericHttp.getDataUsingURL(url).subscribe({
			next: (response: any) => {
				if (response.success === 200 || response.success === true) {
					this.cityList.set(response.data || []);
				} else {
					this.cityList.set([]);
					this.toastr.error(response.message, response.status);
				}
			},
			error: (err: any) => {
				this.cityList.set([]);
				this.toastr.error(err.message, err.status);
			},
			complete: () => {
				this.showResults.set(this.cityList().length > 0);
				// allow blur to close again after result click finishes
				setTimeout(() => (this.suppressBlurClose = false), 0);
			},
		});
	}

	setLocation(item: any): void {
		const label = `${item.city}, ${item.state} - ${item.pincode}`;
		this.searchCity = label;
		this.inputSearchCity = label;

		this.selectedCity = item;  // keep full object
		this.showResults.set(false);
	}


	confirmLocation(): void {
		if (!this.selectedCity) {
			console.warn('No city selected');
			return;
		}

		console.log('Confirm location:', this.searchCity);

		this.inputSearchCity = this.searchCity;

		this.storeLocation(
			this.selectedCity.city,
			this.selectedCity.state,
			this.selectedCity.pincode,
			'manual' // or 'browser' / 'geolocation'
		);
	}

	storeLocation(city: string, state: string, pincode: number, detection_method: string) {
		const body = {
			city,
			state,
			pincode,
			detection_method,
		};

		this.processToStore.set(true);

		this.genericHttp.postDataWithBody(this.storeLocationApi, body).subscribe({
			next: (res: any) => {
				if (res.success === true || res.success === 200) {
					this.toastr.success('Location saved successfully', 'Location');

					this.store.dispatch(
						setUserLocation({ value: { city, state, pincode, detection_method } })
					);

					// save to localStorage
					localStorage.setItem('user_location', JSON.stringify({ city, state, pincode, detection_method }));
					this.modalService.dismissAll();

				} else {
					this.toastr.error(res.message || 'Failed to save location');
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message || 'Error saving location');
				this.processToStore.set(false);

				// Temporary store
				this.store.dispatch(
					setUserLocation({ value: { city, state, pincode, detection_method } })
				);

				// save to localStorage
				sessionStorage.setItem('user_location', JSON.stringify({ city, state, pincode, detection_method }));
				this.modalService.dismissAll();

			},
			complete: () => {
				this.inputSearchCity = '';
				this.searchCity = '';
				this.cityList.set([]);
				this.showResults.set(false);
				this.processToStore.set(false);
			},
		});
	}


	getLocationInfo() {
		this.modalService.open(this.locationConfirmation(), {
			size: 'lg', scrollable: true, centered: false, backdrop: 'static'
		}).result.then(
			() => {

			},
			() => { }
		);
	}


	clearLocation() {
		this.store.dispatch(
			setUserLocation({
				value: {
					city: '',
					state: '',
					pincode: 0,
					detection_method: '',
				},
			})
		);

		localStorage.removeItem('user_location');
		sessionStorage.removeItem('user_location');

		this.selectedCity = null;
		this.inputSearchCity = '';
		this.searchCity = '';
		this.cityList.set([]);
		this.showResults.set(false);
		this.currentLocationLabel.set('');
	}


	// 1. Get GPS coords (Geolocation API)
	getCurrentLocation() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				// 2. Reverse geocode → city + pincode
				this.extractCityPincode(lat, lng).subscribe(result => {
					console.log('result', result);

					this.storeLocation(result.city, result.state, result.pincode, 'auto')

					// {
					// 	"latitude": 21.081240423189808,
					// 	"longitude": 79.06451691313532,
					// 	"city": "Nagpur",
					// 	"pincode": "440025",
					// 	"address_string": "Nagpur, Nagpur Urban Taluka, Nagpur, Maharashtra, 440025, India"
					// }

					// this.saveUserLocation(result);
				});
			}
		);
	}

	// 3. Reverse geocode (Free Nominatim API)
	extractCityPincode(lat: number, lng: number) {
		const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

		return this.http.get<any>(url).pipe(
			map((data: { address: any; display_name: any; }) => {
				const addr = data.address || {};

				return {
					obj: addr,
					latitude: lat,
					longitude: lng,
					city: addr.city || addr.town || addr.municipality || 'Pune',
					state: addr.state,
					pincode: addr.postcode || '',
					address_string: data.display_name || 'Detected location'
				};
			})
		);
	}

}
