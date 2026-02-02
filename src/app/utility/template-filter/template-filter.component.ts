import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-template-filter',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './template-filter.component.html',
	styleUrl: './template-filter.component.scss',
})
export class TemplateFilterComponent {
	private formBuilder = inject(FormBuilder);
	filterForm!: FormGroup;

	dietaryPreferencesList = [
		{ label: 'Veg', value: 'veg' },
		{ label: 'Vegan', value: 'vegan' },
		{ label: 'Non-Veg', value: 'non-veg' },
		{ label: 'Eggetarian', value: 'eggetarian' },
		{ label: 'Other', value: 'other' }
	];

	cuisineTypesList = [
		{ label: 'Andhra Pradesh', value: 'andhra-pradesh' },
		{ label: 'Maharashtrian', value: 'maharashtrian' },
		{ label: 'North Indian', value: 'north-indian' },
		{ label: 'South Indian', value: 'south-indian' },
		{ label: 'Chinese', value: 'chinese' },
		{ label: 'Continental', value: 'continental' },
	];

	mealTypesList = [
		{ label: 'Breakfast', value: 'breakfast' },
		{ label: 'Lunch', value: 'lunch' },
		{ label: 'Dinner', value: 'dinner' },
		{ label: 'Snacks', value: 'snacks' },
		{ label: 'Full-Day Meal', value: 'full-day-meal' }
	];

	portionList = [
		{ label: 'Small', value: 'small' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Large', value: 'large' }
	];

	spiceList = [
		{ label: 'Mild Spice', value: 'mild-spice' },
		{ label: 'Medium Spice', value: 'medium-spice' },
		{ label: 'Extra Spicy', value: 'extra-spicy' }
	];

	HealthAndNutritionList = [
		{ label: 'Low-Calorie', value: 'low-calorie' },
		{ label: 'High-Protein', value: 'high-protein' },
		{ label: 'Keto / Low-Carb', value: 'keto-low-carb' },
		{ label: 'Balanced Diet', value: 'balanced-diet' },
		{ label: 'Sugar-Free', value: 'sugar-free' },
		{ label: 'Low Sodium', value: 'low-sodium' }
	];

	allergensList = [
		{ label: 'Dairy-Free', value: 'dairy-free' },
		{ label: 'Nut-Free', value: 'nut-free' },
		{ label: 'Gluten-Free', value: 'gluten-free' },
		{ label: 'Soy-Free', value: 'soy-free' },
		{ label: 'Egg-Free', value: 'egg-free' },
		{ label: 'Other', value: 'other' }
	];

	specialsList = [
		{ label: 'Popular Meals', value: 'popular-meals' },
		{ label: 'Top-Rated', value: 'top-rated' },
		{ label: "Chef's Special", value: "chef's-special" },
		{ label: 'Seasonal / Festival Specials', value: 'seasonal-festival-specials' },
		{ label: 'Family Packs', value: 'family-packs' }
	];

	priceRangeList = [
		{ label: 'Under ₹100', value: 'under-100' },
		{ label: '₹100 – ₹200', value: '100-200' },
		{ label: '₹200 – ₹300', value: '200-300' },
		{ label: '₹300+', value: '300-plus' }
	];

	ratingsAndReviewsList = [
		{ label: '4 & Above', value: '4-and-above' },
		{ label: 'Top-Rated by Users', value: 'top-rated-by-users' }
	];

	sections = [
		{ key: 'dietaryPreferences', label: 'Dietary' },
		{ key: 'cuisineTypes', label: 'Cuisine' },
		{ key: 'mealTypes', label: 'Meal Type' },
		{ key: 'portion', label: 'Portion' },
		{ key: 'spice', label: 'Spice Level' },
		{ key: 'HealthAndNutrition', label: 'Health & Nutrition' },
		{ key: 'allergens', label: 'Allergens' },
		{ key: 'specials', label: 'Specials' },
		{ key: 'priceRange', label: 'Price' },
		{ key: 'ratingsAndReviews', label: 'Ratings' }
	];

	activeSection = 'dietaryPreferences';

	constructor() {
		this.filterForm = this.formBuilder.group({
			dietaryPreferences: ['veg', [Validators.required]],
			dietaryPreferences_other: [''],

			cuisineTypes: ['', [Validators.required]],

			mealTypes: ['', [Validators.required]],
			portion: ['', [Validators.required]],
			spice: ['', [Validators.required]],

			HealthAndNutrition: ['', [Validators.required]],
			HealthAndNutrition_lowCalorieValue: [''],
			HealthAndNutrition_highProteinValue: [''],

			allergens: ['', [Validators.required]],
			allergens_other: [''],

			specials: ['', [Validators.required]],
			priceRange: ['', [Validators.required]],
			ratingsAndReviews: ['', [Validators.required]],
		});

		this.setupOtherWatcher('dietaryPreferences');
		this.setupOtherWatcher('allergens');
		this.setupHealthNutritionValueWatchers();
	}

	private setupOtherWatcher(baseControl: 'dietaryPreferences' | 'allergens') {
		const control = this.filterForm.get(baseControl);
		const otherControl = this.filterForm.get(baseControl + '_other');

		if (!control || !otherControl) return;

		control.valueChanges.subscribe(val => {
			if (val === 'other') {
				otherControl.addValidators(Validators.required);
			} else {
				otherControl.clearValidators();
				otherControl.setValue('');
			}
			otherControl.updateValueAndValidity({ emitEvent: false });
		});
	}

	private setupHealthNutritionValueWatchers() {
		const ctrl = this.filterForm.get('HealthAndNutrition');
		const lowCtrl = this.filterForm.get('HealthAndNutrition_lowCalorieValue');
		const highCtrl = this.filterForm.get('HealthAndNutrition_highProteinValue');

		if (!ctrl || !lowCtrl || !highCtrl) return;

		ctrl.valueChanges.subscribe(val => {
			lowCtrl.clearValidators();
			highCtrl.clearValidators();

			if (val === 'low-calorie') {
				lowCtrl.setValidators([Validators.required]);
				highCtrl.setValue('');
			} else if (val === 'high-protein') {
				highCtrl.setValidators([Validators.required]);
				lowCtrl.setValue('');
			} else {
				lowCtrl.setValue('');
				highCtrl.setValue('');
			}

			lowCtrl.updateValueAndValidity({ emitEvent: false });
			highCtrl.updateValueAndValidity({ emitEvent: false });
		});
	}

	setActiveSection(key: string) {
		this.activeSection = key;
	}

	onApply() {
		if (this.filterForm.valid) {
			console.log('Filters', this.filterForm.value);
			return;
		}

		this.filterForm.markAllAsTouched();

		// 1) handle "other" text for dietary
		if (
			this.filterForm.get('dietaryPreferences')?.value === 'other' &&
			this.filterForm.get('dietaryPreferences_other')?.invalid
		) {
			this.openAccordion('collapseDiet');
			return;
		}

		// 2) handle low-calorie value
		if (
			this.filterForm.get('HealthAndNutrition')?.value === 'low-calorie' &&
			this.filterForm.get('HealthAndNutrition_lowCalorieValue')?.invalid
		) {
			this.openAccordion('collapseHealth');
			return;
		}

		// 3) handle high-protein value
		if (
			this.filterForm.get('HealthAndNutrition')?.value === 'high-protein' &&
			this.filterForm.get('HealthAndNutrition_highProteinValue')?.invalid
		) {
			this.openAccordion('collapseHealth');
			return;
		}

		// 4) handle allergens "other"
		if (
			this.filterForm.get('allergens')?.value === 'other' &&
			this.filterForm.get('allergens_other')?.invalid
		) {
			this.openAccordion('collapseAllergens');
			return;
		}
	}

	private openAccordion(id: string) {
		const target = document.getElementById(id);
		if (!target) return;

		// 1) close all collapses in this accordion
		const accordion = document.getElementById('filterAccordion');
		if (accordion) {
			const allCollapses = accordion.querySelectorAll('.accordion-collapse');
			allCollapses.forEach(c => {
				c.classList.remove('show');
				const headerBtn = c.previousElementSibling?.querySelector('.accordion-button');
				if (headerBtn) {
					headerBtn.classList.add('collapsed');
				}
			});
		}

		// 2) open the requested one
		target.classList.add('show');

		const btn = target.previousElementSibling?.querySelector('.accordion-button');
		if (btn) {
			btn.classList.remove('collapsed');
		}

		// 3) scroll into view
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}


}
