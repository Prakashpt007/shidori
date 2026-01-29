import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: "",
		redirectTo: "home",
		pathMatch: "full"
	},
	{
		path: "login",
		loadComponent: () => import('./core/authentication/login/login.component').then(c => c.LoginComponent),
		data: { title: "Login Page" }
	},
	{
		path: "register",
		loadComponent: () => import('./core/authentication/register/register.component').then(c => c.RegisterComponent),
		data: { title: "Register Page" }
	},
	{
		path: "onboarding",
		loadComponent: () => import('./core/onboarding/onboarding.component').then(c => c.OnboardingComponent),
		data: { title: "Onboarding Page" }
	},
	{
		path: "",
		loadComponent: () => import('./structure/main-container/main-container.component').then(c => c.MainContainerComponent),
		children: [
			{
				path: "home",
				loadComponent: () => import('./views/home/home.component').then(c => c.HomeComponent),
				data: { title: "Home Page" }
			}

		]
	},
	{
		path: "",
		loadComponent: () => import('./structure/common-layout/common-layout.component').then(c => c.CommonLayoutComponent),
		// loadComponent: () => import('./structure/main-container/main-container.component').then(c => c.MainContainerComponent),
		children: [
			{
				path: "about",
				loadComponent: () => import('./views/about/about.component').then(c => c.AboutComponent),
				data: { title: "About Page" }
			},
			{
				path: "services",
				loadComponent: () => import('./views/services/services.component').then(c => c.ServicesComponent),
				data: { title: "Services Page" }
			},
			{
				path: "subscription-plans",
				loadComponent: () => import('./views/subscription-plans/subscription-plans.component').then(c => c.SubscriptionPlansComponent),
				data: { title: "Subscription Plans Page" }
			},
			{
				path: "regional-cuisines",
				loadComponent: () => import('./views/regional-cuisines/template.component').then(c => c.TemplateComponent),
				data: { title: "Regional Cuisines", filter: true },
				children: [
					{
						path: "",
						loadComponent: () => import('./views/regional-cuisines/all-regions/all-regions.component').then(c => c.AllRegionsComponent),
					},
					{
						path: "type/:id",
						loadComponent: () => import('./views/regional-cuisines/cuisine-type/cuisine-type.component').then(c => c.CuisineTypeComponent),
						data: { title: "Regional Cuisines" }
					},
				]
			},

			{
				path: "international-cuisines",
				loadComponent: () => import('./views/international-cuisines/template.component').then(c => c.TemplateComponent),
				data: { title: "International Cuisines", filter: true },
				children: [
					{
						path: "",
						loadComponent: () => import('./views/international-cuisines/all-regions/all-regions.component').then(c => c.AllRegionsComponent),
					},
					{
						path: "type/:id",
						loadComponent: () => import('./views/international-cuisines/cuisine-type/cuisine-type.component').then(c => c.CuisineTypeComponent),
						data: { title: "International Cuisines" }
					},
				]
			},


			{
				path: "special-cuisines",
				loadComponent: () => import('./views/special-cuisines/template/template.component').then(c => c.TemplateComponent),
				data: { title: "Special Cuisines", filter: true },
				children: [
					{
						path: "",
						loadComponent: () => import('./views/special-cuisines/all/all.component').then(c => c.AllComponent),
					},
					{
						path: "type/:id",
						loadComponent: () => import('./views/special-cuisines/cuisine-type/cuisine-type.component').then(c => c.CuisineTypeComponent),
						data: { title: "Special Cuisines" }
					},
				]
			},

			{
				path: "shopping/cart",
				loadComponent: () => import('./views/shopping/cart/cart.component').then(c => c.CartComponent),
				data: { title: "Shopping Cart" }
			},

			{
				path: "shopping/wishlist",
				loadComponent: () => import('./views/shopping/wishlist/wishlist.component').then(c => c.WishlistComponent),
				data: { title: "Shopping Wishlist" }
			},

			{
				path: "shopping/item-details/:id",
				loadComponent: () => import('./views/shopping/item-details/item-details.component').then(c => c.ItemDetailsComponent),
				data: { title: "Item Details" }
			},

		]
	},
	{
		path: "**",
		loadComponent: () => import('./core/error/error-404/error-404.component').then(c => c.Error404Component),
		data: { title: "Error 404 Page" }
	}
];
