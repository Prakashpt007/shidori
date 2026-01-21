import { Component, Inject, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, hydrateCartlist, hydrateCartQuantities, hydrateWishlist } from './utility/store/store.reducer';
import { RouterOutlet } from '@angular/router';


@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'Shidori';
	private store = inject(Store<AppState>);

	ngOnInit(): void {
		this.store.dispatch(hydrateWishlist());
		this.store.dispatch(hydrateCartlist());
		this.store.dispatch(hydrateCartQuantities());
	}
}