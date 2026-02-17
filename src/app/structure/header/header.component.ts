import { HttpClient } from '@angular/common/http';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs/operators';
import { GenericHttpService } from '../../services/generic-http.service';
import { Store } from '@ngrx/store';
import { AppState, setUserLocation, UserLocation } from '../../utility/store/store.reducer';
import { selectCartlist, selectUserLocation, selectWishlist } from '../../utility/store/store.selectors';
import { CommonModule } from '@angular/common';
import { GenFiltersComponent } from "../../utility/gen-filters/gen-filters.component";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule, GenFiltersComponent],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
	readonly locationConfirmation = viewChild.required<ElementRef>('locationConfirmation');
	private modalService = inject(NgbModal);
	private http = inject(HttpClient);
	private store = inject(Store<AppState>);
	private toastr = inject(ToastrService);
	private genericHttp = inject(GenericHttpService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);

	listApi = '/assets/jsons/locations.json';
	storeLocationApi = 'save-location';
	selectedCity: any | null = null;

	inputSearchCity = '';
	searchCity = ''; // final selected string
	cityList = signal<any[]>([]);
	showResults = signal<boolean>(false);
	userLocation$ = this.store.select(selectUserLocation);

	processToStore = signal<boolean>(false);
	private suppressBlurClose = false;
	currentLocationLabel = signal<string>('');

	filterModalTrigger = false;


	private filterSignal = toSignal(
		this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => this.route.firstChild?.snapshot.data['filter'] ?? false)
		),
		{ initialValue: false }
	);

	showFilter = computed(() => this.filterSignal());


	wishlistCount$ = this.store.select(selectWishlist).pipe(
		map(ids => ids?.length ?? 0)
	);

	cartCount$ = this.store.select(selectCartlist).pipe(
		map(ids => ids?.length ?? 0)
	);

	constructor() {
		// Single subscription: update header label + inputs from store
		this.userLocation$.subscribe(loc => {
			if (loc) {
				const label = `${loc.city}, ${loc.state} - ${loc.pincode}`;
				this.currentLocationLabel.set(label);
				this.searchCity = label;
				this.inputSearchCity = label;
			} else {
				this.currentLocationLabel.set('');
			}
		});
	}

	ngOnInit() {

		// Hydrate from local/session storage only if store has no location yet
		this.userLocation$.pipe(
			map(loc => !!loc)
		).subscribe(hasLoc => {
			if (hasLoc || this.searchCity) return;

			const raw =
				localStorage.getItem('user_location') ??
				sessionStorage.getItem('user_location');

			if (!raw) return;

			try {
				const saved = JSON.parse(raw) as UserLocation;
				const value: UserLocation = {
					city: saved.city,
					state: saved.state,
					pincode: +saved.pincode,
					detection_method: saved.detection_method ?? 'manual'
				};

				const label = `${value.city}, ${value.state} - ${value.pincode}`;
				this.searchCity = label;
				this.inputSearchCity = label;

				// Push into store so rest of app uses same source of truth
				this.store.dispatch(setUserLocation({ value }));
			} catch {
				// ignore parse errors
			}
		});
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

	onInputBlur(_: FocusEvent): void {
		if (this.suppressBlurClose) {
			return;
		}
		this.showResults.set(false);
	}

	onResultMouseDown(event: MouseEvent): void {
		this.suppressBlurClose = true;
		event.preventDefault();
	}

	getCities(searchTxt: string): void {
		const url = this.listApi + '?search=' + encodeURIComponent(searchTxt);

		this.genericHttp.getDataUsingURL(url).subscribe({
			next: (response: any) => {
				if (response.status === 200 && response.success === true) {
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
				setTimeout(() => (this.suppressBlurClose = false), 0);
			},
		});
	}

	setLocation(item: any): void {
		const label = `${item.city}, ${item.state} - ${item.pincode}`;
		this.searchCity = label;
		this.inputSearchCity = label;

		this.selectedCity = item;
		this.showResults.set(false);
	}

	confirmLocation(): void {
		if (!this.selectedCity) {
			console.warn('No city selected');
			return;
		}

		this.inputSearchCity = this.searchCity;

		this.storeLocation(
			this.selectedCity.city,
			this.selectedCity.state,
			this.selectedCity.pincode,
			'manual'
		);
	}

	storeLocation(city: string, state: string, pincode: number, detection_method: string) {
		const body = { city, state, pincode, detection_method };

		this.processToStore.set(true);

		this.genericHttp.postDataWithBody(this.storeLocationApi, body).subscribe({
			next: (res: any) => {
				if (res.success === true || res.success === 200) {
					this.toastr.success('Location saved successfully', 'Location');

					const value: UserLocation = { city, state, pincode, detection_method };
					this.store.dispatch(setUserLocation({ value }));
					localStorage.setItem('user_location', JSON.stringify(value));
					this.modalService.dismissAll();
				} else {
					this.toastr.error(res.message || 'Failed to save location');
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message || 'Error saving location');

				const value: UserLocation = { city, state, pincode, detection_method };
				this.store.dispatch(setUserLocation({ value }));
				sessionStorage.setItem('user_location', JSON.stringify(value));
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
			size: 'lg',
			scrollable: true,
			centered: false,
			backdrop: 'static'
		}).result.then(
			() => { },
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

	getCurrentLocation() {
		console.log('getCurrentLocation');
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				this.extractCityPincode(lat, lng).subscribe(result => {
					this.storeLocation(result.city, result.state, +result.pincode, 'auto');
				});
			}
		);
	}

	extractCityPincode(lat: number, lng: number) {
		console.log('extractCityPincode => ', lat, lng);

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
