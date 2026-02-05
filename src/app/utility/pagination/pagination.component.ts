import { Component, input, OnChanges, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-pagination',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, NgbPaginationModule],
	providers: [NgbPaginationConfig],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges {
	readonly totalRecords = input.required<number>();
	readonly recordsPerPage = input.required<number>();
	readonly currentPage = input.required<number>();
	readonly pageSizeList = input<number[]>([]);

	activePage!: number;
	pageSize!: number;

	math = Math;

	constructor(config: NgbPaginationConfig) {
		config.size = 'sm';
		config.boundaryLinks = true;
	}

	ngOnChanges(): void {
		const currentPage = this.currentPage();
		this.activePage = currentPage == undefined ? 1 : Number(currentPage);
		this.pageSize = this.recordsPerPage();
	}

	readonly onPageChange = output<number>();
	readonly onPageSizeChange = output<number>();

	pageSizeChange(event: any) {
		this.onPageSizeChange.emit(event);
	}

	pageChange(e: any) {
		this.onPageChange.emit(e);
	}

	get showingFrom(): number {
		const total = this.totalRecords();
		if (!total) return 0;
		return (this.activePage - 1) * this.pageSize + 1;
	}

	get showingTo(): number {
		const total = this.totalRecords();
		if (!total) return 0;
		return this.math.min(this.activePage * this.pageSize, total);
	}
}