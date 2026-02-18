
import { CommonModule } from '@angular/common';
import { Component, input, output, computed, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DropdownOption {
	id: number;
	label: string;
	value: string;
}


@Component({
	selector: 'app-searchable-dropdown',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './searchable-dropdown.component.html',
	styleUrl: './searchable-dropdown.component.scss'
})
export class SearchableDropdownComponent {
	// Inputs
	// options = input.required<Signal<DropdownOption[]>>({ alias: 'options' });
	options = input.required<DropdownOption[]>();
	selectedValue = input<string>('all');
	placeholder = input<string>('items');
	buttonPrefix = input<string>('List of');

	// Outputs
	valueChange = output<string>();

	// Private state
	searchTerm = signal<string>('');

	// Computed
	buttonLabel = computed(() => {
		const opt = this.options().find(o => o.value === this.selectedValue());
		console.log(this.options());

		return opt ? opt.label : this.buttonPrefix();
	});

	filteredOptions = computed(() => {
		const term = this.searchTerm().toLowerCase().trim();
		const opts = this.options();

		if (!term || opts.length <= 5) return opts;

		return opts.filter(opt =>
			opt.label.toLowerCase().includes(term)
		);
	});

	filterOptions() {
		// Signal auto-updates
	}

	selectOption(value: string) {
		this.valueChange.emit(value);
		this.searchTerm.set('');

		// Close Bootstrap dropdown
		const dropdown = document.querySelector('.dropdown-toggle') as HTMLElement;
		const bsDropdown = (dropdown as any)?._bsDropdown;
		if (bsDropdown) bsDropdown.hide();
	}
}
