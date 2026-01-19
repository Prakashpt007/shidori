import { Injectable } from '@angular/core';

const CARTLIST_KEY = 'ck_cartlist_ids';

@Injectable({
	providedIn: 'root'
})
export class CartlistStorageService {
	load(): number[] {
		try {
			const raw = localStorage.getItem(CARTLIST_KEY);
			return raw ? JSON.parse(raw) as number[] : [];
		} catch {
			return [];
		}
	}

	save(ids: number[]): void {
		try {
			localStorage.setItem(CARTLIST_KEY, JSON.stringify(ids));
		} catch {
			// ignore storage errors
		}
	}
}