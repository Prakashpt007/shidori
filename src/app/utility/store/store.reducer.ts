// store.reducer.ts
import { createAction, createReducer, on, props } from '@ngrx/store';

export interface UserLocation {
	city: string;
	state: string;
	pincode: number;
	detection_method: string;
}

export interface State {
	location: UserLocation | null;
	wishlist: number[];
	cartlist: number[];
}

export const initialState: State = {
	location: null,
	wishlist: [],
	cartlist: [],
};

//---------------------- Actions -------------------------------//

// location
export const setUserLocation = createAction(
	'[User Location] Set',
	props<{ value: UserLocation }>()
);

// wishlist
export const setWishlist = createAction(
	'[Wishlist] Set All',
	props<{ ids: number[] }>()
);

export const addToWishlist = createAction(
	'[Wishlist] Add',
	props<{ id: number }>()
);

export const removeFromWishlist = createAction(
	'[Wishlist] Remove',
	props<{ id: number }>()
);

export const toggleWishlistItem = createAction(
	'[Wishlist] Toggle',
	props<{ id: number }>()
);

// hydrate wishlist from storage
export const hydrateWishlist = createAction('[Wishlist] Hydrate');

export const hydrateWishlistSuccess = createAction(
	'[Wishlist] Hydrate Success',
	props<{ ids: number[] }>()
);

// cartlist
export const setCartlist = createAction(
	'[Cartlist] Set All',
	props<{ ids: number[] }>()
);

export const addToCartlist = createAction(
	'[Cartlist] Add',
	props<{ id: number }>()
);

export const removeFromCartlist = createAction(
	'[Cartlist] Remove',
	props<{ id: number }>()
);

export const toggleCartlistItem = createAction(
	'[Cartlist] Toggle',
	props<{ id: number }>()
);

// hydrate cartlist from storage
export const hydrateCartlist = createAction('[Cartlist] Hydrate');

export const hydrateCartlistSuccess = createAction(
	'[Cartlist] Hydrate Success',
	props<{ ids: number[] }>()
);

//---------------------- Reducer -------------------------------//

export const storeReducer = createReducer(
	initialState,

	// location
	on(setUserLocation, (state, { value }) => ({
		...state,
		location: value,
	})),

	// wishlist: replace whole list (API/localStorage)
	on(setWishlist, (state, { ids }) => ({
		...state,
		wishlist: [...ids],
	})),

	// wishlist: add single id
	on(addToWishlist, (state, { id }) => ({
		...state,
		wishlist: state.wishlist.includes(id)
			? state.wishlist
			: [...state.wishlist, id],
	})),

	// wishlist: remove single id
	on(removeFromWishlist, (state, { id }) => ({
		...state,
		wishlist: state.wishlist.filter(itemId => itemId !== id),
	})),

	// wishlist: toggle
	on(toggleWishlistItem, (state, { id }) => ({
		...state,
		wishlist: state.wishlist.includes(id)
			? state.wishlist.filter(itemId => itemId !== id)
			: [...state.wishlist, id],
	})),

	// wishlist: hydrate success (from localStorage)
	on(hydrateWishlistSuccess, (state, { ids }) => ({
		...state,
		wishlist: [...ids],
	})),

	// cartlist: replace whole list (API/localStorage)
	on(setCartlist, (state, { ids }) => ({
		...state,
		cartlist: [...ids],       // fixed: was Cartlist
	})),

	// cartlist: add single id
	on(addToCartlist, (state, { id }) => ({
		...state,
		cartlist: state.cartlist.includes(id)
			? state.cartlist
			: [...state.cartlist, id],
	})),

	// cartlist: remove single id
	on(removeFromCartlist, (state, { id }) => ({
		...state,
		cartlist: state.cartlist.filter(itemId => itemId !== id),
	})),

	// cartlist: toggle
	on(toggleCartlistItem, (state, { id }) => ({
		...state,
		cartlist: state.cartlist.includes(id)
			? state.cartlist.filter(itemId => itemId !== id)
			: [...state.cartlist, id],
	})),

	// cartlist: hydrate success (from localStorage)
	on(hydrateCartlistSuccess, (state, { ids }) => ({
		...state,
		cartlist: [...ids],
	}))
);

//---------------------- App State -------------------------------//

export interface AppState {
	store: State;
}
