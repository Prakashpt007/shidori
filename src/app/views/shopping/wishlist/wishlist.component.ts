import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { addToCartlist, AppState, removeFromWishlist, toggleCartlistItem, toggleWishlistItem } from '../../../utility/store/store.reducer';
import { GenericHttpService } from '../../../services/generic-http.service';
import { selectCartlist, selectWishlist } from '../../../utility/store/store.selectors';
import { CommonModule } from '@angular/common';
import { Item } from '../../../utility/interfaces/gen-interface';
import { GenericFunctionService } from '../../../services/generic-function.service';




@Component({
	selector: 'app-wishlist',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './wishlist.component.html',
	styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
	// signals
	wishlistItems = signal<Item[]>([]);
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
	private genFn = inject(GenericFunctionService);

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
					if (response.status === 200 && response.success === true) {
						this.wishlistItems.set(response.data as Item[]);
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

	trackById = (_: number, item: Item) => item.id;

	viewDetails(item: Item) {
		this.router.navigate(['/shopping/item-details', item.id]);
	}


	moveToCart(item: Item) {
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
}
