import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartQuantityItem, State } from './store.reducer';

// 1. Feature selector for 'store' slice
export const selectStoreState = createFeatureSelector<State>('store');

// 2. Selectors for each state property
export const selectUserLocation = createSelector(
	selectStoreState,
	state => state.location
);

export const selectWishlist = createSelector(
	selectStoreState,
	state => state.wishlist
);

export const selectCartlist = createSelector(
	selectStoreState,
	state => state.cartlist
);

export const selectCartQuantities = createSelector(
	selectStoreState,
	state => state.cartQuantities
);

// helper: get quantity for one id
export const selectCartQuantityForId = (id: number) => createSelector(
	selectCartQuantities,
	(items: CartQuantityItem[]) => {
		const found = items.find(q => q.id === id);
		return found ? found.quantity : 0;
	}
);
