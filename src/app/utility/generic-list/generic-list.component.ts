import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../services/generic-http.service';
import { AppState, toggleCartlistItem, toggleWishlistItem } from '../store/store.reducer';
import { Store } from '@ngrx/store';
import { selectCartlist, selectWishlist } from '../store/store.selectors';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GenericFunctionService } from '../../services/generic-function.service';

@Component({
	selector: 'app-generic-list',
	standalone: true,
	imports: [CommonModule, CarouselModule, RouterLink],
	templateUrl: './generic-list.component.html',
	styleUrl: './generic-list.component.scss'
})
export class GenericListComponent {
	@ViewChild('owlCarousel', { static: false })
	owlCarousel!: CarouselComponent;

	customOptions: OwlOptions = {
		loop: true,
		mouseDrag: true,
		touchDrag: true,
		pullDrag: false,
		dots: false,
		navSpeed: 700,
		nav: false,
		navText: ['<i class="fa-solid fa-angles-left"></i> Prev', 'Next <i class="fa-solid fa-angles-right"></i>'],

		autoWidth: true,
		margin: 24,
		autoplay: true,
		autoplayTimeout: 5000,
		autoplaySpeed: 700,
		autoplayHoverPause: true,
		autoplayMouseleaveTimeout: 5000,
		center: true,        // keep active slide in visual center
		stagePadding: 0    // how much of side items you want visible
	};


	private toastr = inject(ToastrService);
	private router = inject(Router);
	private genericHttp = inject(GenericHttpService);
	private genFn = inject(GenericFunctionService);
	private store = inject(Store<AppState>);

	wishlist$ = this.store.select(state => state.store.wishlist);
	cartlist$ = this.store.select(state => state.store.cartlist);

	private cartlistIds = new Set<number>();
	private wishlistIds = new Set<number>();

	listApi = input<any>('');

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
	foodClass(foodClass: string | null | undefined): string {
		return this.genFn.getFoodClass(foodClass);
	}

	// Food class label
	foodClassLabel(foodClass: string | null | undefined): string {
		return this.genFn.getFoodClassLabel(foodClass);
	}

	// // Rating color class
	// getRatingClass(rating: number): string {
	// 	if (rating >= 4.5) return 'rating--high';
	// 	if (rating >= 3.5) return 'rating--mid';
	// 	return 'rating--low';
	// }

	// Rating color class for every 0.5 increment
	getRating(rating: number): string {
		return this.genFn.getRatingClass(rating);
	}

	viewDetails(id: number) {
		// navigate or open modal as you like
		this.router.navigate(['/shopping/item-details', id]);
		console.log('View details', id);
	}
}
