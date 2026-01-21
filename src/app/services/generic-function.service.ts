import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GenericFunctionService {

	constructor() { }




	// Rating color class for every 0.5 increment
	getRatingClass(rating: number): string {
		if (rating >= 4.5 && rating <= 5) return 'rating--4-5';
		if (rating >= 4 && rating < 4.5) return 'rating--4';
		if (rating >= 3.5 && rating < 4) return 'rating--3-5';
		if (rating >= 3 && rating < 3.5) return 'rating--3';
		if (rating >= 2.5 && rating < 3) return 'rating--2-5';
		if (rating >= 2 && rating < 2.5) return 'rating--2';
		if (rating >= 1.5 && rating < 2) return 'rating--1-5';
		if (rating >= 1 && rating < 1.5) return 'rating--1';
		if (rating >= 0 && rating < 1) return 'rating--0';
		if (rating == 0) return 'rating--no-rating';
		return 'rating--unknown'; // in case rating is negative or invalid
	}


	// Food class label
	getFoodClassLabel(foodClass: string | null | undefined): string {
		switch (foodClass) {
			case 'NON_VEG':
				return 'NON-VEG';
			case 'VEG':
				return 'VEG';
			case 'VEGAN':
				return 'VEGAN';
			case 'JAIN':
				return 'JAIN';
			case 'EGG':
				return 'EGG FOOD';
			case 'SEAFOOD':
				return 'SEAFOOD';
			default:
				return foodClass ?? '';
		}
	}


	// Food class CSS class
	getFoodClass(foodClass: string | null | undefined): string {
		switch (foodClass) {
			case 'NON_VEG':
				return 'nonveg';
			case 'VEG':
				return 'veg';
			case 'VEGAN':
				return 'vegan';
			case 'JAIN':
				return 'jain';
			case 'EGG':
				return 'egg-food';
			case 'SEAFOOD':
				return 'see-food';
			default:
				return '';
		}
	}
}
