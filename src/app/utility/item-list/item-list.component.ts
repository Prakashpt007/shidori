import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../services/generic-http.service';
import { AppState, toggleCartlistItem, toggleWishlistItem } from '../store/store.reducer';
import { Store } from '@ngrx/store';
import { selectCartlist, selectWishlist } from '../store/store.selectors';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-item-list',
	standalone: true,
	imports: [CommonModule, CarouselModule, RouterLink],
	templateUrl: './item-list.component.html',
	styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
	@ViewChild('owlCarousel', { static: false })
	owlCarousel!: CarouselComponent;

	customOptions: OwlOptions = {
		loop: false,              // change to true if you want infinite
		mouseDrag: true,
		touchDrag: true,
		pullDrag: false,
		dots: false,
		nav: true,
		navSpeed: 700,
		autoWidth: true,
		margin: 32,
		autoplay: true,
		autoplayTimeout: 5000,
		autoplaySpeed: 700,
		autoplayHoverPause: true,
		autoplayMouseleaveTimeout: 5000,
		center: false,
		stagePadding: 25,
		rewind: true,
		slideBy: 1
	};


	private toastr = inject(ToastrService);
	private router = inject(Router);
	private genericHttp = inject(GenericHttpService);
	private store = inject(Store<AppState>);

	wishlist$ = this.store.select(state => state.store.wishlist);
	cartlist$ = this.store.select(state => state.store.cartlist);

	private cartlistIds = new Set<number>();
	private wishlistIds = new Set<number>();

	listApi = input<any>('');
	viewAllRouteLink = input<any>('');

	itemList = signal<any[]>([]);
	loadingData = signal<boolean>(false);
	errorMessage = signal<{ name: string, message: string } | null>(null);

	constructor() {

		// Get Wishlist Array
		this.store.select(selectWishlist).subscribe(ids => {
			this.wishlistIds = new Set(ids ?? []);
		});

		// Get Cartlist Array
		this.store.select(selectCartlist).subscribe(ids => {
			this.cartlistIds = new Set(ids ?? []);
		});


	}




	ngOnInit() {

		if (this.listApi() !== '') {

			this.getList(this.listApi());
		}
	}

	getList(url: string) {
		this.loadingData.set(true);
		this.genericHttp.getDataUsingURL(url).subscribe({
			next: (response: any) => {
				if (response.success == 200 || response.success == true) {

					this.itemList.set(response.data);

					if (this.itemList().length > 4) {
						this.customOptions = {
							...this.customOptions,
							loop: true,
							autoplay: true,
							center: true
						}
					} else {
						this.customOptions = {
							...this.customOptions,
							loop: false,
							autoplay: false,
							center: false,
							nav: false,
							dots: false
						}
					}
				} else {
					this.toastr.error(response.message, response.status);
					this.loadingData.set(false);
				}

			},
			error: (err: any) => {
				this.toastr.error(err.message, err.status);
				this.loadingData.set(false);
				this.errorMessage.set({ name: err.status, message: err.message });
			},
			complete: () => {
				// console.log('completed');
				this.loadingData.set(false);

			}
		});
	}

	getDiscountedPercentage(discountValue: number, basePrice: number): string {
		if (basePrice <= 0) return "0%";

		const percentage = (discountValue / basePrice) * 100;
		const capped = Math.min(Math.max(percentage, 0), 100);

		return `${Math.round(capped)}%`;
	}

	getDiscountedPrice(discountValue: number, basePrice: number): string {
		if (basePrice <= 0) return "0";
		const discountedPrice = basePrice - discountValue;
		const finalPrice = Math.max(discountedPrice, 0);
		return finalPrice.toFixed(2);
	}

	getWishlistItem(id: number): boolean {
		return this.wishlistIds.has(id);
	}

	toggleWishlist(id: number) {
		this.store.dispatch(toggleWishlistItem({ id }));
	}

	getCartlistItem(id: number): boolean {
		return this.cartlistIds.has(id);
	}

	toggleCartlist(id: number) {
		this.store.dispatch(toggleCartlistItem({ id }));
	}

	// Food class CSS class
	getFoodClassClass(foodClass: string | null | undefined): string {
		switch (foodClass) {
			case 'NON_VEG':
				return 'nonveg';
			case 'VEG':
				return 'veg';
			case 'VEGAN':
				return 'vegan';
			case 'JAIN':
				return 'jain';
			case 'EGG':
				return 'egg-food';
			case 'SEAFOOD':
				return 'see-food';
			default:
				return '';
		}
	}

	// Food class label
	getFoodClassLabel(foodClass: string | null | undefined): string {
		switch (foodClass) {
			case 'NON_VEG':
				return 'NON-VEG';
			case 'VEG':
				return 'VEG';
			case 'VEGAN':
				return 'VEGAN';
			case 'JAIN':
				return 'JAIN';
			case 'EGG':
				return 'EGG FOOD';
			case 'SEAFOOD':
				return 'SEAFOOD';
			default:
				return foodClass ?? '';
		}
	}

	// Rating color class
	getRatingClass(rating: number): string {
		if (rating >= 4.5) return 'rating--high';
		if (rating >= 3.5) return 'rating--mid';
		return 'rating--low';
	}

	viewDetails(id: number) {
		// navigate or open modal as you like
		this.router.navigate(['/shopping/item-details', id]);
		console.log('View details', id);
	}
}
