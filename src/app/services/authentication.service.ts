import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private httpClient = inject(HttpClient);
	private router = inject(Router);
	private toastr = inject(ToastrService);

	baseUrl = environment.baseUrl;

	private handleError(error: HttpErrorResponse) {
		let msg = 'Something went wrong. Please try again.';

		if (error.status === 0) {
			msg = 'Network error. Please check your internet connection.';
		} else if (error.status === 400) {
			msg = 'Invalid data. Please check the form.';
		} else if (error.status === 401 || error.status === 403) {
			msg = 'You are not authorized to perform this action.';
		} else if (error.status === 404) {
			msg = 'Requested resource not found.';
		} else if (error.status >= 500) {
			msg = 'Server error. Please try again after some time.';
		}

		// if backend sends a message, prefer that
		if (error.error && typeof error.error === 'string') {
			msg = error.error;
		} else if (error.error?.message) {
			msg = error.error.message;
		}

		return throwError(() => msg);
	}


	isUserLoggedIn(): boolean {
		return !!sessionStorage?.getItem("tokenAccess");
	}


	getAuthToken() {
		return sessionStorage.getItem('tokenAccess');
	}

	logOut(): void {
		sessionStorage.clear();
		this.router.navigate(['/login']);
	}

	isUserSessionValid(): boolean {
		const session = sessionStorage.getItem('expires_in');
		if (!session) {
			return false; // no expiry -> invalid
		}

		const sessionDate = new Date(session);
		const currentDate = new Date();

		return sessionDate.getTime() > currentDate.getTime();
	}


	addHrToDate(minutesToAdd: number): Date {
		const currentDate = new Date();
		const hoursToAdd = minutesToAdd / 60;
		const newDate = new Date(currentDate.getTime());
		newDate.setHours(newDate.getHours() + hoursToAdd);
		return newDate;
	}

	trimString(str: string): string {
		const [usernamePart] = str.split('@');
		return usernamePart
			.split(/[_.]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
}
