import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
// import { AuthenticationService } from '../services/authentication.service';

const PUBLIC_ENDPOINTS = ['/public-kpi'];

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthenticationService);

	// 1) Public endpoints → skip auth header
	const isPublicApi = PUBLIC_ENDPOINTS.some(path => req.url.includes(path));
	if (isPublicApi) {
		return next(req);
	}

	// 2) Private endpoints → check login
	const token = authService.getAuthToken();

	// if you want to force logout on missing token, uncomment:
	// if (!token) {
	//   authService.logOut();
	//   return next(req); // or throwError(() => new Error('Not logged in'));
	// }

	// 3) Attach token when present
	const authReq = token
		? req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		})
		: req;

	return next(authReq);
};
