import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Kitchen } from '../../../../utility/interfaces/gen-interface';
import { GenericHttpService } from '../../../../services/generic-http.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

type KitchenAssignFilter = 'assigned' | 'not-assigned';

@Component({
	selector: 'app-cloud-kitchens',
	standalone: true,
	imports: [CommonModule],
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

	page = signal<number>(1);
	size = signal<number>(20);
	totalItems = signal<number>(0);

	private readonly listApi = '/assets/jsons/kitchen.json';

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(params => {
			const pageParam = params.get('page');
			const sizeParam = params.get('size');

			// if present in URL, override defaults
			if (pageParam) {
				const p = Number(pageParam);
				if (p > 0) this.page.set(p);
			}

			if (sizeParam) {
				const s = Number(sizeParam);
				if (s > 0) this.size.set(s);
			}

			// if either missing, write current signal values back into URL once
			if (!pageParam || !sizeParam) {
				this.router.navigate([], {
					relativeTo: this.route,
					queryParams: {
						page: this.page(),  // uses default 1 if not overridden
						size: this.size()   // uses default 10/20 if not overridden
					},
					queryParamsHandling: 'merge',
					replaceUrl: true
				});
				return;
			}

			this.fetchKitchens(); // or fetchKitchens()
		});
	}

	private updateQueryParams() {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				page: this.page(),
				size: this.size()
			},
			queryParamsHandling: 'merge'
		});
	}

	setEmpStatus(value: KitchenAssignFilter) {
		this.empStatus.set(value);
		this.page.set(1);
		this.updateQueryParams();
		this.fetchKitchens();
	}

	setPage(page: number) {
		if (page < 1) return;
		this.page.set(page);
		this.updateQueryParams();
		this.fetchKitchens();
	}

	// if you later add page-size control:
	setSize(size: number) {
		this.size.set(size);
		this.page.set(1);
		this.updateQueryParams();
		this.fetchKitchens();
	}

	fetchKitchens() {
		const empStatus = this.empStatus();
		const page = this.page();
		const size = this.size();

		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			assigned: empStatus === 'assigned' ? 'true' : 'false'
		}).toString();

		const urlWithParams = `${this.listApi}?${params}`;

		this.genericHttp.getDataUsingURL(urlWithParams).subscribe({
			next: (response: any) => {
				if (response.success === 200 || response.success === true) {
					const all: Kitchen[] = response.data;

					const filtered = all.filter(k =>
						empStatus === 'assigned' ? k.assigned === true : k.assigned === false
					);

					const start = (page - 1) * size;
					const end = start + size;
					this.totalItems.set(filtered.length);
					this.list.set(filtered.slice(start, end));
				} else {
					this.toastr.error(response.message, response.status);
					this.list.set([]);
					this.totalItems.set(0);
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message, err.status);
				this.list.set([]);
				this.totalItems.set(0);
			}
		});
	}
}
