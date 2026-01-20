import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class GenericHttpService {
	baseUrl: string = environment.baseUrl;
	private http = inject(HttpClient);

	constructor() { }


	private handleError(error: HttpErrorResponse) {
		let errorPayload = {
			status: error.status ?? 0,
			message: 'Something went wrong. Please try again.',
		};

		// Network / client side
		if (error.error instanceof ErrorEvent) {
			errorPayload = {
				status: 0,
				message: error.error.message || 'Network error. Please check your connection.',
			};
		} else {
			// If backend returns HTML (like your <html>…Cannot GET…</html>)
			const raw = error.error;

			if (typeof raw === 'string') {
				if (raw.includes('<!DOCTYPE html') || raw.includes('<html')) {
					// HTML error page → map to friendly message
					if (error.status === 404) {
						errorPayload.message = 'Requested resource not found.';
					} else {
						errorPayload.message = 'Server returned an unexpected response.';
					}
				} else {
					// Plain string from backend
					errorPayload.message = raw;
				}
			} else if (raw?.message) {
				// JSON with { message: '...' }
				errorPayload.message = raw.message;
			} else if (error.status === 404) {
				errorPayload.message = 'Requested resource not found.';
			} else if (error.status === 0) {
				errorPayload.message = 'Network error. Please check your connection.';
			} else if (error.status >= 500) {
				errorPayload.message = 'Server error. Please try again later.';
			}
		}

		return throwError(() => errorPayload);
	}

	getDataUsingURL(url: string,): Observable<any> {
		return this.http.get<any>(url).pipe(catchError(this.handleError));
	}

	postDataWithBody(url: string, body: any): Observable<any> {
		// return this.http.post<any>(this.baseUrl + "/" + url, body).pipe(catchError(this.handleError));
		return this.http.post<any>(url, body).pipe(catchError(this.handleError));
	}
}
