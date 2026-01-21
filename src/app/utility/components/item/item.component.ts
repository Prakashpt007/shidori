import { Component, inject, input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';
import { GenericFunctionService } from '../../../services/generic-function.service';
import { AppState, toggleCartlistItem, toggleWishlistItem } from '../../store/store.reducer';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Item } from '../../interfaces/gen-interface';

@Component({
	selector: 'app-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './item.component.html',
	styleUrl: './item.component.scss'
})
export class ItemComponent {
	data = input<Item | null>(null as any);

	isInWishlist: InputSignal<boolean> = input<boolean>(false);
	isInCartlist: InputSignal<boolean> = input<boolean>(false);


	private router = inject(Router);
	private genFn = inject(GenericFunctionService);
	private store = inject(Store<AppState>);

	toggleWishlist(id: number | undefined) {
		if (typeof id === 'number') {
			this.store.dispatch(toggleWishlistItem({ id }));
		}
	}

	toggleCartlist(id: number | undefined) {
		if (typeof id === 'number') {
			this.store.dispatch(toggleCartlistItem({ id }));
		}
	}

	foodClass(foodClass: string | null | undefined): string {
		return this.genFn.getFoodClass(foodClass);
	}

	foodClassLabel(foodClass: string | null | undefined): string {
		return this.genFn.getFoodClassLabel(foodClass);
	}

	getRating(rating: number | null | undefined): string {
		return this.genFn.getRatingClass(rating ?? 0);
	}

	viewDetails(id: number | undefined) {
		if (typeof id === 'number') {
			this.router.navigate(['/shopping/item-details', id]);
		} else {
			alert('Item ID is invalid.');
		}
	}
}
