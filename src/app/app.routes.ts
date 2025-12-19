import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "login", loadComponent: () => import('./core/authentication/login/login.component').then(c => c.LoginComponent), data: { title: "Login Page" } },
	{ path: "register", loadComponent: () => import('./core/authentication/register/register.component').then(c => c.RegisterComponent), data: { title: "Register Page" } },
	{
		path: "**",
		loadComponent: () => import('./core/error/error-404/error-404.component').then(c => c.Error404Component), data: { title: "Error 404 Page" }
	}
];
