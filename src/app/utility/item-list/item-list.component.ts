import { Component, ElementRef, inject, input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../services/generic-http.service';
import { AppState, toggleCartlistItem, toggleWishlistItem } from '../store/store.reducer';
import { Store } from '@ngrx/store';
import { selectCartlist, selectWishlist } from '../store/store.selectors';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GenericFunctionService } from '../../services/generic-function.service';
import { ItemComponent } from '../components/item/item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-item-list',
	standalone: true,
	imports: [CommonModule, CarouselModule, RouterLink, ItemComponent],
	templateUrl: './item-list.component.html',
	styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
	private toastr = inject(ToastrService);
	private genericHttp = inject(GenericHttpService);
	private store = inject(Store<AppState>);

	wishlist$ = this.store.select(state => state.store.wishlist);
	cartlist$ = this.store.select(state => state.store.cartlist);

	cartlistIds = new Set<number>();
	wishlistIds = new Set<number>();

	listApi = input<any>('');
	viewAllRouteLink = input<any>('');

	itemList = signal<any[]>([]);
	loadingData = signal<boolean>(false);
	errorMessage = signal<{ name: string, message: string } | null>(null);

	constructor() {

		// console.log('sss');

		// this.store.select(selectWishlist).subscribe(ids => {
		// 	this.wishlistIds = new Set(ids ?? []);
		// });


		// this.store.select(selectCartlist).subscribe(ids => {
		// 	this.cartlistIds = new Set(ids ?? []);
		// });

		// Get Wishlist Array
		this.store.select(selectWishlist)
			.pipe(takeUntilDestroyed())
			.subscribe(ids => this.wishlistIds = new Set(ids ?? []));

		// Get Cartlist Array
		this.store.select(selectCartlist)
			.pipe(takeUntilDestroyed())
			.subscribe(ids => this.cartlistIds = new Set(ids ?? []));
	}

	ngOnInit() {

		if (this.listApi() !== '') {

			this.getList(this.listApi());
		}
	}

	getList(url: string) {
		this.loadingData.set(true);
		this.genericHttp.getDataUsingURL(url).subscribe({
			next: (response: any) => {
				if (response.success == 200 || response.success == true) {
					this.itemList.set(response.data);

				} else {
					this.toastr.error(response.message, response.status);
				}

				this.loadingData.set(false);
			},
			error: (err: any) => {
				this.toastr.error(err.message, err.status);
				this.loadingData.set(false);
				this.errorMessage.set({ name: err.status, message: err.message });
			},
			complete: () => {
				// console.log('completed');
				this.loadingData.set(false);

			}
		});
	}


	getWishlistItem(id: number): boolean {
		return this.wishlistIds.has(id);
	}

	getCartlistItem(id: number): boolean {
		return this.cartlistIds.has(id);
	}


	//----------------------- Drag to scroll functionality -----------------------//
	@ViewChildren('slider')
	sliders!: QueryList<ElementRef<HTMLDivElement>>;

	private isDown: boolean[] = [];
	private startX: number[] = [];
	private scrollLeft: number[] = [];

	onMouseDown(e: MouseEvent, idx: number) {
		const slider = this.sliders.get(idx)?.nativeElement;
		if (!slider) return;

		this.isDown[idx] = true;
		slider.classList.add('active');
		this.startX[idx] = e.pageX - slider.offsetLeft;
		this.scrollLeft[idx] = slider.scrollLeft;

		// disable snap while dragging so it doesn’t fight
		slider.style.scrollSnapType = 'none';
		e.preventDefault();
	}

	onMouseLeave(idx: number) {
		this.endDrag(idx);
	}

	onMouseUp(idx: number) {
		this.endDrag(idx);
	}

	private endDrag(idx: number) {
		const slider = this.sliders.get(idx)?.nativeElement;
		if (!slider) return;

		this.isDown[idx] = false;
		slider.classList.remove('active');

		// re‑enable snap so it finishes on the nearest card
		slider.style.scrollSnapType = 'x mandatory';
	}

	onMouseMove(e: MouseEvent, idx: number) {
		if (!this.isDown[idx]) return;

		const slider = this.sliders.get(idx)?.nativeElement;
		if (!slider) return;

		e.preventDefault();
		const x = e.pageX - slider.offsetLeft;
		const walk = (x - this.startX[idx]) * 1; // same as your JS
		slider.scrollLeft = this.scrollLeft[idx] - walk;
	}

	onTouchStart(e: TouchEvent, idx: number) {
		const slider = this.sliders.get(idx)?.nativeElement;
		if (!slider) return;

		// only single-finger drag; ignore pinch, etc.
		if (e.touches.length !== 1) return;

		this.isDown[idx] = true;
		slider.classList.add('active');

		const touch = e.touches[0];
		const rect = slider.getBoundingClientRect();

		// simulate your mouse coordinates
		this.startX[idx] = touch.clientX - rect.left;
		this.scrollLeft[idx] = slider.scrollLeft;

		slider.style.scrollSnapType = 'none';
		e.preventDefault();
	}

	onTouchMove(e: TouchEvent, idx: number) {
		if (!this.isDown[idx]) return;

		const slider = this.sliders.get(idx)?.nativeElement;
		if (!slider) return;

		if (e.touches.length !== 1) return;

		const touch = e.touches[0];
		const rect = slider.getBoundingClientRect();

		const x = touch.clientX - rect.left;
		const walk = (x - this.startX[idx]) * 1; // same speed factor as mouse
		slider.scrollLeft = this.scrollLeft[idx] - walk;

		e.preventDefault();
	}

}
