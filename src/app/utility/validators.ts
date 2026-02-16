import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validatePdf(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!value || typeof value !== 'string') return null;
		const ext = value.split('.').pop()?.toLowerCase();
		return ext === 'pdf' ? null : { invalidPdf: true };
	};
}

export function validateImage(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!value || typeof value !== 'string') return null;
		const allowedExt = ['jpeg', 'jpg', 'png'];
		const ext = value.split('.').pop()?.toLowerCase();
		return allowedExt.includes(ext!) ? null : { invalidImage: true };
	};
}
