import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { addToCartlist, AppState, removeFromWishlist, toggleCartlistItem, toggleWishlistItem } from '../../../utility/store/store.reducer';
import { GenericHttpService } from '../../../services/generic-http.service';
import { selectCartlist, selectWishlist } from '../../../utility/store/store.selectors';
import { CommonModule } from '@angular/common';


export interface WishlistItem {
	id: number;
	name: string;
	image_url: string;
	description: string;
	food_class: string; // 'VEGAN' | 'VEG' | 'NON_VEG'
	address: string;
	base_price: number;
	rating: number;
}


@Component({
	selector: 'app-wishlist',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './wishlist.component.html',
	styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
	// signals
	wishlistItems = signal<WishlistItem[]>([]);
	loadingData = signal<boolean>(false);
	errorMessage = signal<{ name: string; message: string } | null>(null);

	// API endpoint that accepts { ids: number[] } and returns WishlistItem[]
	listApi = signal<string>('/assets/jsons/wishlist-items.json');

	private store = inject(Store<AppState>);

	// store selectors
	wishlistIds$ = this.store.select(selectWishlist);   // number[]
	cartlistIds$ = this.store.select(selectCartlist);   // number[]

	// local Sets for quick lookups
	private wishlistIdsSet = new Set<number>();
	private cartlistIdsSet = new Set<number>();

	private toastr = inject(ToastrService);
	private router = inject(Router);
	private genericHttp = inject(GenericHttpService);

	constructor() {
		// keep local Sets in sync with store (used by getWishlistItem/getCartlistItem)
		this.wishlistIds$.subscribe(ids => {
			this.wishlistIdsSet = new Set(ids ?? []);
		});

		this.cartlistIds$.subscribe(ids => {
			this.cartlistIdsSet = new Set(ids ?? []);
		});
	}

	ngOnInit() {
		// when wishlist IDs change, refetch items
		this.wishlistIds$.subscribe(ids => {
			if (!ids || !ids.length) {
				this.wishlistItems.set([]);
				return;
			}
			if (this.listApi()) {
				this.fetchWishlistItems(ids);
			}
		});
	}

	private fetchWishlistItems(ids: number[]) {
		this.loadingData.set(true);
		this.genericHttp.postDataWithBody(this.listApi(), { ids })
			.subscribe({
				next: (response: any) => {
					if (response.success === 200 || response.success === true) {
						this.wishlistItems.set(response.data as WishlistItem[]);
					} else {
						this.toastr.error(response.message, response.status);
					}
					this.loadingData.set(false);
				},
				error: (err: any) => {
					this.toastr.error(err.message, err.status);
					this.loadingData.set(false);
					this.errorMessage.set({ name: err.status, message: err.message });
				}
			});
	}

	// helpers for buttons/icons (if needed in template)
	getWishlistItem(id: number): boolean {
		return this.wishlistIdsSet.has(id);
	}

	getCartlistItem(id: number): boolean {
		return this.cartlistIdsSet.has(id);
	}

	// actions
	toggleWishlist(id: number) {
		this.store.dispatch(toggleWishlistItem({ id }));
	}

	toggleCartlist(id: number) {
		this.store.dispatch(toggleCartlistItem({ id }));
	}

	trackById = (_: number, item: WishlistItem) => item.id;

	viewDetails(item: WishlistItem) {
		this.router.navigate(['/menu', item.id]);
	}

	moveToCart(item: WishlistItem) {
		// add to cart
		this.store.dispatch(toggleCartlistItem({ id: item.id }));
		// remove from wishlist
		this.store.dispatch(toggleWishlistItem({ id: item.id }));

		// optimistic UI update
		this.wishlistItems.set(this.wishlistItems().filter(i => i.id !== item.id));
		this.toastr.success(`${item.name} added to cart`);
	}

	moveAllToCart() {
		const items = this.wishlistItems();
		if (!items.length) return;

		items.forEach(item => {
			this.store.dispatch(addToCartlist({ id: item.id }));
			this.store.dispatch(removeFromWishlist({ id: item.id }));
		});

		this.wishlistItems.set([]);
		this.toastr.success('All wishlist items moved to cart');
	}

	removeFromWishlist(id: number) {
		this.store.dispatch(removeFromWishlist({ id }));
		this.wishlistItems.set(this.wishlistItems().filter(i => i.id !== id));
		this.toastr.info('Removed from wishlist');
	}
}
