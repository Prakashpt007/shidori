import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Employee } from '../../../../utility/interfaces/gen-interface';
import { GenericHttpService } from '../../../../services/generic-http.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../../utility/pagination/pagination.component';


type EmployeeRoleFilter = 'all' | 'manager' | 'chef' | 'delivery-partner';
type EmployeeAssignFilter = 'assigned' | 'not-assigned';

@Component({
	selector: 'app-employee',
	standalone: true,
	imports: [CommonModule, PaginationComponent, RouterLink],
	templateUrl: './employee.component.html',
	styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
	toastr = inject(ToastrService);
	genericHttp = inject(GenericHttpService);
	route = inject(ActivatedRoute);
	router = inject(Router);

	list = signal<Employee[]>([]);
	empStatus = signal<EmployeeAssignFilter>('assigned');      // UI: assigned / not-assigned
	roleFilter = signal<EmployeeRoleFilter>('all');            // UI: all / manager / chef / delivery-partner

	// pagination
	page = signal<number>(1);
	size = signal<number>(20);
	pageSizes = [10, 20, 30, 50, 100];
	totalItems = signal<number>(0);

	roleOptions: { value: EmployeeRoleFilter; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'manager', label: 'Managers' },
		{ value: 'chef', label: 'Chefs' },
		{ value: 'delivery-partner', label: 'Delivery Partners' }
	];

	private readonly listApi = '/assets/jsons/employee.json';

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(params => {
			const pageParam = params.get('page');
			const sizeParam = params.get('size');
			const assignedParam = params.get('assigned'); // 'true' | 'false'
			const roleParam = params.get('role');     // 'all' | 'manager' | ...

			// page / size (override defaults if present)
			if (pageParam) {
				const p = Number(pageParam);
				if (p > 0) this.page.set(p);
			}
			if (sizeParam) {
				const s = Number(sizeParam);
				if (s > 0) this.size.set(s);
			}

			// assigned filter
			if (assignedParam === 'true') {
				this.empStatus.set('assigned');
			} else if (assignedParam === 'false') {
				this.empStatus.set('not-assigned');
			}

			// role filter
			if (
				roleParam === 'all' ||
				roleParam === 'manager' ||
				roleParam === 'chef' ||
				roleParam === 'delivery-partner'
			) {
				this.roleFilter.set(roleParam);
			}

			// normalize URL if any param is missing
			if (!pageParam || !sizeParam || !assignedParam || !roleParam) {
				this.updateQueryParams(true); // replaceUrl to avoid extra history entry
				return;
			}

			this.fetchEmployees();
		});
	}

	private updateQueryParams(replace = false) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				page: this.page(),
				size: this.size(),
				assigned: this.empStatus() === 'assigned' ? 'true' : 'false',
				role: this.roleFilter()
			},
			queryParamsHandling: 'merge',
			replaceUrl: replace
		});
	}

	setEmpStatus(value: EmployeeAssignFilter) {
		this.empStatus.set(value);
		this.roleFilter.set('all');   // reset role
		this.page.set(1);
		this.updateQueryParams();
	}

	setRoleFilter(value: EmployeeRoleFilter) {
		this.roleFilter.set(value);
		this.empStatus.set('assigned');  // reset assigned
		this.page.set(1);
		this.updateQueryParams();
	}


	setPage(page: number) {
		if (page < 1) return;
		this.page.set(page);
		this.updateQueryParams();
	}

	setSize(event: any) {
		const size = Number(event.target?.value ?? event);
		this.size.set(size);
		this.page.set(1);
		this.updateQueryParams();
	}

	getRoleButtonLabel(): string {
		switch (this.roleFilter()) {
			case 'manager': return 'Managers';
			case 'chef': return 'Chefs';
			case 'delivery-partner': return 'Delivery Partners';
			case 'all':
			default: return 'Employees';
		}
	}

	fetchEmployees() {
		const empStatus = this.empStatus();
		const role = this.roleFilter();
		const page = this.page();
		const size = this.size();

		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			assigned: empStatus === 'assigned' ? 'true' : 'false',
			role
		}).toString();

		const urlWithParams = `${this.listApi}?${params}`;

		this.genericHttp.getDataUsingURL(urlWithParams).subscribe({
			next: (response: any) => {
				if (response.status === 200 && response.success === true) {
					const all: Employee[] = response.data;
					const filtered = this.applyClientFilters(all, empStatus, role); // temp client-side
					this.totalItems.set(filtered.length);
					this.list.set(filtered);
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

	private applyClientFilters(
		all: Employee[],
		empStatus: EmployeeAssignFilter,
		role: EmployeeRoleFilter
	): Employee[] {
		return all.filter(emp => {
			const assignedOk =
				empStatus === 'assigned' ? emp.assigned === true : emp.assigned === false;

			let roleOk = true;
			if (role !== 'all') {
				const position = emp.position.toLowerCase();
				if (role === 'manager') {
					roleOk = position === 'manager';
				} else if (role === 'chef') {
					roleOk = position === 'chef';
				} else if (role === 'delivery-partner') {
					roleOk = position === 'delivery partner';
				}
			}

			return assignedOk && roleOk;
		});
	}

}

