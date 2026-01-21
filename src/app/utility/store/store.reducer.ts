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
	cartlist: number[];                  // ids
	cartQuantities: { [id: number]: number }; // qty per id
}

export const initialState: State = {
	location: null,
	wishlist: [],
	cartlist: [],
	cartQuantities: {}
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

// cart quantities
export const incrementCartQuantity = createAction(
	'[Cartlist] Increment Quantity',
	props<{ id: number }>()
);

export const decrementCartQuantity = createAction(
	'[Cartlist] Decrement Quantity',
	props<{ id: number }>()
);

export const removeCartQuantity = createAction(
	'[Cartlist] Remove Quantity',
	props<{ id: number }>()
);

// quantities storage
export const hydrateCartQuantities = createAction('[CartQty] Hydrate');

export const hydrateCartQuantitiesSuccess = createAction(
	'[CartQty] Hydrate Success',
	props<{ quantities: { [id: number]: number } }>()
);

export const setCartQuantities = createAction(
	'[CartQty] Set All',
	props<{ quantities: { [id: number]: number } }>()
);

//---------------------- Reducer -------------------------------//

export const storeReducer = createReducer(
	initialState,

	// location
	on(setUserLocation, (state, { value }) => ({
		...state,
		location: value
	})),

	// wishlist: replace whole list (API/localStorage)
	on(setWishlist, (state, { ids }) => ({
		...state,
		wishlist: [...ids]
	})),

	// wishlist: add single id
	on(addToWishlist, (state, { id }) => ({
		...state,
		wishlist: state.wishlist.includes(id)
			? state.wishlist
			: [...state.wishlist, id]
	})),

	// wishlist: remove single id
	on(removeFromWishlist, (state, { id }) => ({
		...state,
		wishlist: state.wishlist.filter(itemId => itemId !== id)
	})),

	// wishlist: toggle
	on(toggleWishlistItem, (state, { id }) => ({
		...state,
		wishlist: state.wishlist.includes(id)
			? state.wishlist.filter(itemId => itemId !== id)
			: [...state.wishlist, id]
	})),

	// wishlist: hydrate success (from localStorage)
	on(hydrateWishlistSuccess, (state, { ids }) => ({
		...state,
		wishlist: [...ids]
	})),

	// cartlist: replace whole list (API/localStorage)
	on(setCartlist, (state, { ids }) => ({
		...state,
		cartlist: [...ids]
	})),

	// cartlist: add single id
	on(addToCartlist, (state, { id }) => ({
		...state,
		cartlist: state.cartlist.includes(id)
			? state.cartlist
			: [...state.cartlist, id]
	})),

	// cartlist: remove single id
	on(removeFromCartlist, (state, { id }) => ({
		...state,
		cartlist: state.cartlist.filter(itemId => itemId !== id)
	})),

	// cartlist: toggle + quantities
	on(toggleCartlistItem, (state, { id }) => {
		const inCart = state.cartlist.includes(id);

		if (inCart) {
			// remove from cart and its quantity
			const { [id]: _, ...restQty } = state.cartQuantities;
			return {
				...state,
				cartlist: state.cartlist.filter(itemId => itemId !== id),
				cartQuantities: restQty
			};
		}

		// add to cart, always start qty at 1
		return {
			...state,
			cartlist: [...state.cartlist, id],
			cartQuantities: {
				...state.cartQuantities,
				[id]: 1
			}
		};
	}),

	// quantity ++
	on(incrementCartQuantity, (state, { id }) => ({
		...state,
		cartQuantities: {
			...state.cartQuantities,
			[id]: (state.cartQuantities[id] ?? 0) + 1
		},
		cartlist: state.cartlist.includes(id)
			? state.cartlist
			: [...state.cartlist, id]
	})),

	// quantity -- (remove if goes to 0)
	on(decrementCartQuantity, (state, { id }) => {
		const current = state.cartQuantities[id] ?? 0;

		if (current <= 1) {
			const { [id]: _, ...restQty } = state.cartQuantities;
			return {
				...state,
				cartlist: state.cartlist.filter(itemId => itemId !== id),
				cartQuantities: restQty
			};
		}

		return {
			...state,
			cartQuantities: {
				...state.cartQuantities,
				[id]: current - 1
			}
		};
	}),

	// explicit remove qty (used when deleting / moving to wishlist)
	on(removeCartQuantity, (state, { id }) => {
		const { [id]: _, ...restQty } = state.cartQuantities;
		return {
			...state,
			cartlist: state.cartlist.filter(itemId => itemId !== id),
			cartQuantities: restQty
		};
	}),

	// cartlist: hydrate success (ids) – init qty=1 if missing
	on(hydrateCartlistSuccess, (state, { ids }) => {
		const baseQty: { [id: number]: number } = { ...state.cartQuantities };
		ids.forEach(id => {
			if (!baseQty[id]) baseQty[id] = 1;
		});
		return {
			...state,
			cartlist: [...ids],
			cartQuantities: baseQty
		};
	}),

	// quantities hydrate / set
	on(hydrateCartQuantitiesSuccess, (state, { quantities }) => ({
		...state,
		cartQuantities: { ...quantities }
	})),

	on(setCartQuantities, (state, { quantities }) => ({
		...state,
		cartQuantities: { ...quantities }
	}))
);

//---------------------- App State -------------------------------//

export interface AppState {
	store: State;
}
