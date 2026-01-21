import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GenericFunctionService } from '../../../services/generic-function.service';
import { AppState, decrementCartQuantity, incrementCartQuantity, removeCartQuantity, removeFromCartlist, toggleCartlistItem, toggleWishlistItem } from '../../../utility/store/store.reducer';
import { selectCartlist, selectCartQuantities, selectWishlist } from '../../../utility/store/store.selectors';
import { GenericHttpService } from '../../../services/generic-http.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-item-details',
	imports: [CommonModule],
	standalone: true,
	templateUrl: './item-details.component.html',
	styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {
	detailsVisible: boolean = false;

	cartlistIds = new Set<number>();
	wishlistIds = new Set<number>();
	cartQuantities: { [id: number]: number } = {};

	detailsApiUrl: string = 'assets/jsons/item-details.json';

	private toastr = inject(ToastrService);
	private genericHttp = inject(GenericHttpService);
	private router = inject(Router);
	private genFn = inject(GenericFunctionService);
	private store = inject(Store<AppState>);

	loadingData = signal<boolean>(false);
	errorMessage = signal<{ name: string; message: string } | null>(null);
	dataItem = signal<any>(null);

	constructor() {
		// wishlist ids
		this.store.select(selectWishlist)
			.pipe(takeUntilDestroyed())
			.subscribe(ids => this.wishlistIds = new Set(ids ?? []));

		// cart ids
		this.store.select(selectCartlist)
			.pipe(takeUntilDestroyed())
			.subscribe(ids => this.cartlistIds = new Set(ids ?? []));

		// cart quantities
		this.store.select(selectCartQuantities)
			.pipe(takeUntilDestroyed())
			.subscribe(map => this.cartQuantities = map ?? {});
	}

	ngOnInit() {
		this.getData(this.detailsApiUrl);
	}

	getData(url: string) {
		this.loadingData.set(true);
		this.genericHttp.getDataUsingURL(url).subscribe({
			next: (response: any) => {
				if (response.success == 200 || response.success == true) {
					this.dataItem.set(response.data);
				} else {
					this.toastr.error(response.message, response.status);
				}
				this.loadingData.set(false);
			},
			error: (err: any) => {
				this.toastr.error(err.message, err.status);
				this.loadingData.set(false);
				this.errorMessage.set({ name: err.status, message: err.message });
			},
			complete: () => {
				this.loadingData.set(false);
			}
		});
	}

	// quantity helpers / actions

	getCartQtyForItem(id: number): number {
		return this.cartQuantities?.[id] ?? 0;
	}

	addOrIncrementCart() {
		const item = this.dataItem();
		if (!item || typeof item.id !== 'number') return;

		if (!this.cartlistIds.has(item.id)) {
			// first time: toggle => adds to cart and sets qty=1 via reducer
			this.store.dispatch(toggleCartlistItem({ id: item.id }));
		} else {
			// already in cart => increment qty
			this.store.dispatch(incrementCartQuantity({ id: item.id }));
		}
	}

	decrementCart() {
		const item = this.dataItem();
		if (!item || typeof item.id !== 'number') return;

		this.store.dispatch(decrementCartQuantity({ id: item.id }));
	}

	deleteFromCart() {
		const item = this.dataItem();
		if (!item || typeof item.id !== 'number') return;

		// remove from cartlist (triggers effect -> updates ck_cartlist_ids)
		this.store.dispatch(toggleCartlistItem({ id: item.id }));

		// also clear quantity for safety
		this.store.dispatch(removeCartQuantity({ id: item.id }));
	}


	saveToWishlistAndRemoveFromCart() {
		const item = this.dataItem();
		if (!item || typeof item.id !== 'number') return;

		// toggle / add to wishlist
		this.store.dispatch(toggleWishlistItem({ id: item.id }));

		// remove from cart + qty if present
		if (this.cartlistIds.has(item.id)) {
			this.store.dispatch(removeCartQuantity({ id: item.id }));
		}
	}

	// Food class CSS class
	foodClass(foodClass: string | null | undefined): string {
		return this.genFn.getFoodClass(foodClass);
	}

	// Food class label
	foodClassLabel(foodClass: string | null | undefined): string {
		return this.genFn.getFoodClassLabel(foodClass);
	}

	// Rating color class
	getRating(rating: number | null | undefined): string {
		return this.genFn.getRatingClass(rating ?? 0);
	}
}
