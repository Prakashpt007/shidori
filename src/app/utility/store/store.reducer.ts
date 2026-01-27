// store.reducer.ts
import { createAction, createReducer, on, props } from '@ngrx/store';

export interface UserLocation {
	city: string;
	state: string;
	pincode: number;
	detection_method: string;
}

export interface CartQuantityItem {
	id: number;
	quantity: number;
}

export interface State {
	location: UserLocation | null;
	wishlist: number[];
	cartlist: number[];                 // ids
	cartQuantities: CartQuantityItem[]; // array of {id, quantity}
}

export const initialState: State = {
	location: null,
	wishlist: [],
	cartlist: [],
	cartQuantities: []
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
	props<{ quantities: CartQuantityItem[] }>()
);

export const setCartQuantities = createAction(
	'[CartQty] Set All',
	props<{ quantities: CartQuantityItem[] }>()
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
			// remove from cart + quantities
			return {
				...state,
				cartlist: state.cartlist.filter(itemId => itemId !== id),
				cartQuantities: state.cartQuantities.filter(q => q.id !== id)
			};
		}

		// add: id + quantity=1
		return {
			...state,
			cartlist: [...state.cartlist, id],
			cartQuantities: [
				...state.cartQuantities,
				{ id, quantity: 1 }
			]
		};
	}),

	// quantity ++
	on(incrementCartQuantity, (state, { id }) => {
		const existsInCart = state.cartlist.includes(id);
		const nextCartlist = existsInCart
			? state.cartlist
			: [...state.cartlist, id];

		const existing = state.cartQuantities.find(q => q.id === id);

		let nextQuantities;
		if (existing) {
			nextQuantities = state.cartQuantities.map(q =>
				q.id === id ? { ...q, quantity: q.quantity + 1 } : q
			);
		} else {
			nextQuantities = [...state.cartQuantities, { id, quantity: 1 }];
		}

		return {
			...state,
			cartlist: nextCartlist,
			cartQuantities: nextQuantities
		};
	}),

	// quantity -- (remove if goes to 0)
	on(decrementCartQuantity, (state, { id }) => {
		const existing = state.cartQuantities.find(q => q.id === id);
		if (!existing) return state;

		if (existing.quantity <= 1) {
			// quantity would go to 0 → remove from both
			return {
				...state,
				cartlist: state.cartlist.filter(itemId => itemId !== id),
				cartQuantities: state.cartQuantities.filter(q => q.id !== id)
			};
		}

		return {
			...state,
			cartQuantities: state.cartQuantities.map(q =>
				q.id === id ? { ...q, quantity: q.quantity - 1 } : q
			)
		};
	}),

	// explicit remove (delete button)
	on(removeCartQuantity, (state, { id }) => ({
		...state,
		cartlist: state.cartlist.filter(itemId => itemId !== id),
		cartQuantities: state.cartQuantities.filter(q => q.id !== id)
	})),

	// cartlist: hydrate success (ids) – ensure quantity exists
	on(hydrateCartlistSuccess, (state, { ids }) => {
		const baseQty = [...state.cartQuantities];

		const existingIds = new Set(baseQty.map(q => q.id));
		const added: CartQuantityItem[] = [];

		ids.forEach(id => {
			if (!existingIds.has(id)) {
				added.push({ id, quantity: 1 });
			}
		});

		return {
			...state,
			cartlist: [...ids],
			cartQuantities: [...baseQty, ...added]
		};
	}),

	// quantities hydrate / set
	on(hydrateCartQuantitiesSuccess, (state, { quantities }) => ({
		...state,
		cartQuantities: [...quantities]
	})),

	on(setCartQuantities, (state, { quantities }) => ({
		...state,
		cartQuantities: [...quantities]
	}))
);

//---------------------- App State -------------------------------//

export interface AppState {
	store: State;
}
