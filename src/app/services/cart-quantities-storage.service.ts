// cart-quantities-storage.service.ts
import { Injectable } from '@angular/core';

const CART_QTY_KEY = 'ck_cart_quantities';

@Injectable({ providedIn: 'root' })
export class CartQuantitiesStorageService {
	load(): { [id: number]: number } {
		try {
			const raw = localStorage.getItem(CART_QTY_KEY);
			return raw ? JSON.parse(raw) as { [id: number]: number } : {};
		} catch {
			return {};
		}
	}

	save(map: { [id: number]: number }): void {
		try {
			localStorage.setItem(CART_QTY_KEY, JSON.stringify(map));
		} catch {
			// ignore storage errors
		}
	}
}
