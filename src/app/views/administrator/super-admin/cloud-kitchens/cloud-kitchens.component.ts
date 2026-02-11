import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Kitchen } from '../../../../utility/interfaces/gen-interface';
import { GenericHttpService } from '../../../../services/generic-http.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../../utility/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

type KitchenAssignFilter = 'assigned' | 'not-assigned';

@Component({
	selector: 'app-cloud-kitchens',
	standalone: true,
	imports: [CommonModule, PaginationComponent, MatButtonModule, MatIconModule, MatMenuModule],
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
	pageSizes = [10, 20, 30, 50, 100];
	totalItems = signal<number>(0);

	private readonly listApi = '/assets/jsons/kitchen.json';

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(params => {
			const pageParam = params.get('page');
			const sizeParam = params.get('size');
			const assignedParam = params.get('assigned');

			if (pageParam) {
				const p = Number(pageParam);
				if (p > 0) this.page.set(p);
			}

			if (sizeParam) {
				const s = Number(sizeParam);
				if (s > 0) this.size.set(s);
			}

			if (assignedParam === 'true') {
				this.empStatus.set('assigned');
			} else if (assignedParam === 'false') {
				this.empStatus.set('not-assigned');
			}

			if (!pageParam || !sizeParam || !assignedParam) {
				this.updateQueryParams(true);
				return;
			}

			this.fetchKitchens();
		});
	}

	private updateQueryParams(replace = false) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				page: this.page(),
				size: this.size(),
				assigned: this.empStatus() === 'assigned' ? 'true' : 'false'
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
