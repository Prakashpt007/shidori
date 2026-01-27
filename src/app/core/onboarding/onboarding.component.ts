import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-onboarding',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './onboarding.component.html',
	styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
	private router = inject(Router);

	pages = signal<number>(0);


	constructor() {

		this.pages.set(1);
	}

	submit(): void {

		console.log('Onboarding completed!');
		this.router.navigate(['/home']);

	}
}
