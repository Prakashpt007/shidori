// store.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { hydrateCartlist, hydrateCartlistSuccess, hydrateWishlist, hydrateWishlistSuccess, setCartlist, setWishlist, toggleCartlistItem, toggleWishlistItem, } from './store.reducer';
import { selectCartlist, selectWishlist } from './store.selectors';
import { AppState } from './store.reducer';
import { WishlistStorageService } from '../../services/wishlist-storage.service';
import { CartlistStorageService } from '../../services/cartlist-storage.service';

@Injectable()
export class StoreEffects {
	private actions$ = inject(Actions);
	private store = inject<Store<AppState>>(Store as any);
	private wishlistStorage = inject(WishlistStorageService);
	private cartlistStorage = inject(CartlistStorageService);

	// Load from localStorage
	hydrateWishlist$ = createEffect(() =>
		this.actions$.pipe(
			ofType(hydrateWishlist),
			map(() => {
				const ids = this.wishlistStorage.load();
				return hydrateWishlistSuccess({ ids });
			})
		)
	);

	hydrateCartlist$ = createEffect(() =>
		this.actions$.pipe(
			ofType(hydrateCartlist),
			map(() => {
				const ids = this.cartlistStorage.load();
				return hydrateCartlistSuccess({ ids });
			})
		)
	);

	// Save to localStorage on changes
	persistWishlist$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(toggleWishlistItem, setWishlist),
				withLatestFrom(this.store.select(selectWishlist)),
				tap(([_, ids]) => this.wishlistStorage.save(ids ?? []))
			),
		{ dispatch: false }
	);

	persistCartlist$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(toggleCartlistItem, setCartlist),
				withLatestFrom(this.store.select(selectCartlist)),
				tap(([_, ids]) => this.cartlistStorage.save(ids ?? []))
			),
		{ dispatch: false }
	);
}
