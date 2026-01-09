import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { httpInterceptor } from './interceptors/http.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideStore } from '@ngrx/store';
import { storeReducer } from './utility/store/store.reducer';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideAnimations(),
		provideToastr(),
		importProvidersFrom(NgbModule),
		provideStore({ store: storeReducer }),
		provideHttpClient(
			withInterceptors([
				httpInterceptor,
				// other interceptors, e.g. errorInterceptor, loaderInterceptor
			])
		),
	]
};
