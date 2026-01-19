import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent {
	fb = inject(FormBuilder);
	formSubmitHandler = signal(false);

	registrationForm: FormGroup = this.fb.group({
		name: ['', Validators.required],
		phone: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		dob: ['', Validators.required],
	});


	formSubmit() {
		this.formSubmitHandler.set(true);
		if (this.registrationForm.invalid) return;

		console.log(this.registrationForm?.value);

	}
}
