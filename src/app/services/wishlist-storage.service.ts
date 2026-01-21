// wishlist-storage.service.ts
import { Injectable } from '@angular/core';

const WISHLIST_KEY = 'ck_wishlist_ids';

@Injectable({ providedIn: 'root' })
export class WishlistStorageService {
	load(): number[] {
		try {
			const raw = localStorage.getItem(WISHLIST_KEY);
			return raw ? JSON.parse(raw) as number[] : [];
		} catch {
			return [];
		}
	}

	save(ids: number[]): void {
		try {
			localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
		} catch {
			// ignore storage errors
		}
	}
}
