import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Kitchen } from '../../../../utility/interfaces/gen-interface';
import { GenericHttpService } from '../../../../services/generic-http.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../utility/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs/operators';

type KitchenAssignFilter = 'assigned' | 'not-assigned';

@Component({
	selector: 'app-cloud-kitchens',
	standalone: true,
	imports: [CommonModule, RouterLink, PaginationComponent, MatButtonModule, MatIconModule],
	templateUrl: './cloud-kitchens.component.html',
	styleUrl: './cloud-kitchens.component.scss'
})
export class CloudKitchensComponent {
	toastr = inject(ToastrService);
	genericHttp = inject(GenericHttpService);
	route = inject(ActivatedRoute);
	router = inject(Router);

	list = signal<Kitchen[]>([]);
	empStatus = signal<KitchenAssignFilter>('assigned');
	stateFilter = signal<string>('all');
	page = signal<number>(1);
	size = signal<number>(20);
	pageSizes = [10, 20, 30, 50, 100];
	totalItems = signal<number>(0);
	stateOptions = signal<{ id: number; label: string; value: string }[]>([]);

	private readonly listApi = '/assets/jsons/kitchen.json';
	private readonly stateApi = '/assets/jsons/states.json';

	ngOnInit(): void {
		// Load states first
		this.loadStates();

		// Subscribe to query param changes
		this.route.queryParamMap.subscribe(params => {
			this.updateFromQueryParams(params);
		});
	}

	private updateFromQueryParams(params: any) {
		// Handle pagination params
		const pageParam = params.get('page');
		const sizeParam = params.get('size');
		if (pageParam) {
			const p = Number(pageParam);
			if (p > 0) this.page.set(p);
		}
		if (sizeParam) {
			const s = Number(sizeParam);
			if (s > 0) this.size.set(s);
		}

		// Handle assigned filter
		const assignedParam = params.get('assigned');
		if (assignedParam === 'true') {
			this.empStatus.set('assigned');
		} else if (assignedParam === 'false') {
			this.empStatus.set('not-assigned');
		}

		// Handle state filter - SET IMMEDIATELY from URL
		const stateParam = params.get('state') || 'all';
		this.stateFilter.set(stateParam);

		// Fetch if core params present
		if (pageParam && sizeParam && assignedParam) {
			this.fetchKitchens();
		} else {
			this.updateQueryParams(true);
		}
	}

	private loadStates() {
		this.genericHttp.getDataUsingURL(this.stateApi).subscribe({
			next: (response: any) => {
				if (response.status === 200 && response.success === true) {
					let data = response.data;
					data.unshift({  // Fixed: unshift adds "All States" FIRST
						"id": 0,
						"label": "All States",
						"value": "all"
					});
					this.stateOptions.set(data);

				} else {
					this.toastr.error(response.message || 'Failed to load kitchens', 'Error');
					this.stateOptions.set([]);
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message || 'Network error', 'Error');
				this.stateOptions.set([]);
			}
		});
	}


	private updateQueryParams(replace = false) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				page: this.page(),
				size: this.size(),
				assigned: this.empStatus() === 'assigned' ? 'true' : 'false',
				state: this.stateFilter()
			},
			queryParamsHandling: 'merge',
			replaceUrl: replace
		});
	}

	setEmpStatus(value: KitchenAssignFilter) {
		this.empStatus.set(value);
		this.page.set(1);
		this.updateQueryParams();
	}

	setStateFilter(value: string) {
		this.stateFilter.set(value);
		this.empStatus.set('assigned');
		this.page.set(1);
		this.updateQueryParams();
	}

	getStateButtonLabel(): string {
		const option = this.stateOptions().find(opt => opt.value === this.stateFilter());
		return option?.label || 'All States';
	}

	setPage(page: number) {
		if (page < 1) return;
		this.page.set(page);
		this.updateQueryParams();
	}

	setSize(size: number) {
		this.size.set(Number(size));
		this.page.set(1);
		this.updateQueryParams();
	}

	fetchKitchens() {
		const empStatus = this.empStatus();
		const stateFilterValue = this.stateFilter();
		const page = this.page();
		const size = this.size();

		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			assigned: empStatus === 'assigned' ? 'true' : 'false',
			state: stateFilterValue
		}).toString();

		const urlWithParams = `${this.listApi}?${params}`;
		// console.log('🔍 API Call:', urlWithParams);  // Debug log

		this.genericHttp.getDataUsingURL(urlWithParams).subscribe({
			next: (response: any) => {
				if (response.status === 200 && response.success === true) {
					let all: Kitchen[] = response.data;

					// Client-side state filtering
					if (stateFilterValue !== 'all') {
						all = all.filter(k =>
							k.state && k.state.toLowerCase() === stateFilterValue
						);
					}

					// Filter by assigned status
					const filtered = all.filter(k =>
						empStatus === 'assigned' ? k.assigned === true : k.assigned === false
					);

					const start = (page - 1) * size;
					const end = start + size;
					this.totalItems.set(filtered.length);
					this.list.set(filtered.slice(start, end));
				} else {
					this.toastr.error(response.message || 'Failed to load kitchens', 'Error');
					this.list.set([]);
					this.totalItems.set(0);
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message || 'Network error', 'Error');
				this.list.set([]);
				this.totalItems.set(0);
			}
		});
	}
}
