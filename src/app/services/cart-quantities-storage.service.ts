// cart-quantities-storage.service.ts
import { Injectable } from '@angular/core';
import { CartQuantityItem } from '../utility/store/store.reducer';

const CART_QTY_KEY = 'ck_cart_quantities';

@Injectable({ providedIn: 'root' })
export class CartQuantitiesStorageService {
	load(): CartQuantityItem[] {
		try {
			const raw = localStorage.getItem(CART_QTY_KEY);
			return raw ? JSON.parse(raw) as CartQuantityItem[] : [];
		} catch {
			return [];
		}
	}

	save(list: CartQuantityItem[]): void {
		try {
			localStorage.setItem(CART_QTY_KEY, JSON.stringify(list));
		} catch {
			// ignore storage errors
		}
	}
}