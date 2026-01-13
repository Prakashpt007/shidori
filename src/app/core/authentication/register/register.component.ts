import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent {
	fb = inject(FormBuilder);

	registrationForm: FormGroup = this.fb.group({
		name: ['', Validators.required],
		phone: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		dob: ['', Validators.required],
	});
}
