import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
	fb = inject(FormBuilder);

	loginForm: FormGroup = this.fb.group({
		email: [
			"prakashpt007@gmail.com",
			[
				Validators.required,
				Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|info|biz|co|us|uk|ca|au|in|de|cn|jp|ai|blog|tech|online|app|io)$/),
				Validators.minLength(6),
				Validators.maxLength(145)
			]
		],
		authType: [false, Validators.required],
		password: ['', Validators.required],
	});

	formSubmitHandler = signal(false);
	otpFormSubmitHandler = signal(false);

	otpLogin = signal<boolean>(false);

	otpLength = 6;
	otpForm!: FormGroup;


	ngOnInit(): void {
		// Create a FormGroup with 6 FormControls for OTP
		const controlsConfig: { [key: string]: FormControl } = {};
		for (let i = 0; i < this.otpLength; i++) {
			controlsConfig[`otp${i}`] = new FormControl('', [
				Validators.required,
				Validators.pattern(/^[0-9]$/)
			]);
		}
		this.otpForm = this.fb.group(controlsConfig);

		// CONDITIONAL PASSWORD VALIDATION
		this.loginForm.get('authType')?.valueChanges.subscribe((isOtpLogin: boolean) => {
			const passwordControl = this.loginForm.get('password');

			if (isOtpLogin === false) {
				// Password login → password required
				passwordControl?.setValidators([Validators.required]);
			} else {
				// OTP login → password not required
				passwordControl?.clearValidators();
				passwordControl?.setValue('');
			}

			passwordControl?.updateValueAndValidity();
		});

	}

	// Send OTP handler
	sendOTP() {
		this.formSubmitHandler.set(true);
		if (this.loginForm.invalid) return;

		const email = this.loginForm.get('email')?.value;
		console.log('Sending OTP to:', email);
		this.otpLogin.set(true);
	}



	maskEmail(email: string): string {
		if (!email) return '';

		const [username, domain] = email.split('@');
		const [_, ext] = domain.split('.');

		// First 2 characters
		const start = username.slice(0, 2);

		// Last 2 characters
		const end = username.slice(-2);

		// Mask middle part
		const middleLength = Math.max(username.length - 4, 0);
		const maskedMiddle = '*'.repeat(middleLength);

		return `${start}${maskedMiddle}${end}@*****.${ext}`;
	}

	get f(): { [key: string]: AbstractControl } {
		return this.loginForm.controls;
	}

	formSubmit() {
		this.formSubmitHandler.set(true);
		if (this.loginForm.invalid) return;

		console.log('Login Form:', this.loginForm.value);
	}


	otpLoginFormSubmit() {
		this.otpFormSubmitHandler.set(true);
		if (this.otpForm.invalid) return;

		const email = this.loginForm.get('email')?.value;

		// Combine OTP into a single string / number
		const otp = Number(Object.values(this.otpForm.value).join(''));

		console.log({
			email: email,
			otp: otp
		});
	}

	// OTP input handlers
	onInput(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/[^0-9]/g, '');
		this.otpForm.get(`otp${index}`)?.setValue(input.value);

		if (input.value && index < this.otpLength - 1) {
			const nextInput = input.nextElementSibling as HTMLInputElement;
			nextInput?.focus();
		}
	}

	onKeydown(event: KeyboardEvent, index: number) {
		const input = event.target as HTMLInputElement;
		if (event.key === 'Backspace') {
			if (input.value) {
				this.otpForm.get(`otp${index}`)?.setValue('');
				return;
			}
			if (index > 0) {
				const prevInput = input.previousElementSibling as HTMLInputElement;
				prevInput.focus();
				this.otpForm.get(`otp${index - 1}`)?.setValue('');
			}
		}
	}

	onPaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text') || '';
		const digits = pastedData.replace(/\D/g, '').slice(0, this.otpLength);

		digits.split('').forEach((digit, idx) => {
			this.otpForm.get(`otp${idx}`)?.setValue(digit);
		});

		const inputs = (event.target as HTMLElement).parentElement?.querySelectorAll('input');
		if (inputs) {
			digits.split('').forEach((digit, idx) => {
				(inputs[idx] as HTMLInputElement).value = digit;
			});
			const nextInput = inputs[digits.length] as HTMLInputElement;
			nextInput?.focus();
		}
	}

	isValid(): boolean {
		return this.otpForm.valid;
	}

}


