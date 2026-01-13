import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
	fb = inject(FormBuilder);

	loginForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		authType: [false, Validators.required],
		credential: ['', Validators.required]
	});
}
