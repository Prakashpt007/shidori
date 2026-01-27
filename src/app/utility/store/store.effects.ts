// store.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import {
	AppState,
	decrementCartQuantity,
	hydrateCartlist,
	hydrateCartlistSuccess,
	hydrateCartQuantities,
	hydrateCartQuantitiesSuccess,
	hydrateWishlist,
	hydrateWishlistSuccess,
	incrementCartQuantity,
	removeCartQuantity,
	setCartlist,
	setCartQuantities,
	setWishlist,
	toggleCartlistItem,
	toggleWishlistItem
} from './store.reducer';
import {
	selectCartlist,
	selectCartQuantities,
	selectWishlist
} from './store.selectors';
import { WishlistStorageService } from '../../services/wishlist-storage.service';
import { CartlistStorageService } from '../../services/cartlist-storage.service';
import { CartQuantitiesStorageService } from '../../services/cart-quantities-storage.service';

@Injectable()
export class StoreEffects {
	private actions$ = inject(Actions);
	private store = inject<Store<AppState>>(Store as any);
	private wishlistStorage = inject(WishlistStorageService);
	private cartlistStorage = inject(CartlistStorageService);
	private cartQtyStorage = inject(CartQuantitiesStorageService);

	// Load wishlist
	hydrateWishlist$ = createEffect(() =>
		this.actions$.pipe(
			ofType(hydrateWishlist),
			map(() => {
				const ids = this.wishlistStorage.load();
				return hydrateWishlistSuccess({ ids });
			})
		)
	);

	// Load cart ids
	hydrateCartlist$ = createEffect(() =>
		this.actions$.pipe(
			ofType(hydrateCartlist),
			map(() => {
				const ids = this.cartlistStorage.load();
				return hydrateCartlistSuccess({ ids });
			})
		)
	);

	// Save wishlist
	persistWishlist$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(toggleWishlistItem, setWishlist),
				withLatestFrom(this.store.select(selectWishlist)),
				tap(([_, ids]) => this.wishlistStorage.save(ids ?? []))
			),
		{ dispatch: false }
	);

	// Save cart ids
	persistCartlist$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(toggleCartlistItem, setCartlist, removeCartQuantity),
				withLatestFrom(this.store.select(selectCartlist)),
				tap(([_, ids]) => this.cartlistStorage.save(ids ?? []))
			),
		{ dispatch: false }
	);

	// Load quantities (array)
	hydrateCartQuantities$ = createEffect(() =>
		this.actions$.pipe(
			ofType(hydrateCartQuantities),
			map(() => {
				const quantities = this.cartQtyStorage.load();
				return hydrateCartQuantitiesSuccess({ quantities });
			})
		)
	);

	// Save quantities on changes
	persistCartQuantities$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(
					incrementCartQuantity,
					decrementCartQuantity,
					removeCartQuantity,
					toggleCartlistItem,
					setCartQuantities
				),
				withLatestFrom(this.store.select(selectCartQuantities)),
				tap(([_, quantities]) => this.cartQtyStorage.save(quantities ?? []))
			),
		{ dispatch: false }
	);
}
