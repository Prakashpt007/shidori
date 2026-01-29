import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
	value: string;
	label: string;
}

@Component({
	selector: 'app-searchable-select',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './searchable-select.component.html',
	styleUrl: './searchable-select.component.scss'
})

export class SearchableSelectComponent {
	@Input() options: SelectOption[] = [];
	@Input() placeholder = 'Select option';
	@Input() buttonClass = 'btn btn-secondary'; // allow override
	@Input() dropdownWidthClass = 'w-100';

	@Input() set selectedId(value: number | string | null) {
		this._selectedId = value;
		this.updateSelectedLabelFromId();
	}
	get selectedId(): number | string | null {
		return this._selectedId;
	}

	@Output() selectedChange = new EventEmitter<SelectOption>();

	private _selectedId: number | string | null = null;

	searchText = '';
	filteredOptions = signal<SelectOption[]>([]);
	selectedLabel = '';

	ngOnInit(): void {
		this.filteredOptions.set(this.options ?? []);
		this.updateSelectedLabelFromId();
	}

	ngOnChanges(): void {
		// when options input changes, re-filter
		this.filteredOptions.set(this.options ?? []);
		this.updateSelectedLabelFromId();
	}

	private updateSelectedLabelFromId(): void {
		if (this._selectedId == null) {
			this.selectedLabel = '';
			return;
		}
		const found = (this.options ?? []).find(o => o.value === this._selectedId);
		this.selectedLabel = found?.label ?? '';
	}

	onSearchChange(): void {
		const term = this.searchText.toLowerCase();
		const base = this.options ?? [];
		this.filteredOptions.set(
			base.filter(o => o.label.toLowerCase().includes(term))
		);
	}

	selectOption(option: SelectOption): void {
		this._selectedId = option.value;
		this.selectedLabel = option.label;
		this.selectedChange.emit(option);
	}
}
