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
}

export const initialState: State = {
	location: null,
};

// action
export const setUserLocation = createAction(
	'[User Location] Set',
	props<{ value: UserLocation }>()
);

// reducer
export const storeReducer = createReducer(
	initialState,
	on(setUserLocation, (state, { value }) => ({ ...state, location: value }))
);

// app state
export interface AppState {
	store: State;
}
