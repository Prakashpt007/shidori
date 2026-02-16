import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, AfterViewInit, signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AutosizeModule } from 'ngx-autosize';
import { validateImage, validatePdf } from '../../../../../utility/validators';

@Component({
	selector: 'app-manager',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink, AutosizeModule],
	templateUrl: './manager.component.html',
	styleUrl: './manager.component.scss'
})
export class ManagerComponent implements OnInit, AfterViewInit, OnDestroy {



	form!: FormGroup;
	formSubmitHandler = signal(false);

	formBuilder = inject(FormBuilder);
	minDate!: any;
	maxDate!: any;

	constructor() {
		this.form = this.formBuilder.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|info|biz|co|us|uk|ca|au|in|de|cn|jp|ai|blog|tech|online|app|io)$/), Validators.minLength(6), Validators.maxLength(145)]],
			dob: ['', [Validators.required]],
			mobile: ['', [Validators.pattern(/^[0-9]\d*$/), Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
			aadhar: ['', [Validators.required, validatePdf()]],
			photo: ['', [Validators.required, validateImage()]],
			bank_account_no: ['', [Validators.required]],
			ifsc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
			pan: ['', [Validators.required, validatePdf()]],
			cheque_book: ['', [Validators.required, validatePdf()]],
			permanent_address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(145)]],
			current_address: ['', [Validators.required]],
		});

		this.setDate();
	}

	setDate() {
		let date = new Date();
		let date2 = new Date();
		date.setFullYear(date.getFullYear() - 18);
		this.maxDate = date.toISOString().split("T")[0];
		// this.maxDate = date.toISOString().split("T")[0];
		date2.setFullYear(date2.getFullYear() - 100);
		this.minDate = date2.toISOString().split("T")[0];
	}


	ngOnInit(): void {

	}

	ngAfterViewInit(): void {

	}

	ngOnDestroy(): void {
	}

	get f(): { [key: string]: AbstractControl; } {
		return this.form.controls;
	}


	onFileChange(event: any, controlName: string) {
		const file = event.target.files[0];
		if (file) {
			this.form.get(controlName)?.setValue(file.name); // Triggers re-validation
			// Optionally store full File for upload: this.selectedFiles[controlName] = file;
		}
	}

	formSubmit() {
		this.formSubmitHandler.set(true);

		if (this.form.invalid) {
			return;
		} else {
			console.log(this.form.value);


		}
	}
}
