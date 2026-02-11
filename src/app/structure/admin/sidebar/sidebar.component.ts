import { Component, signal } from '@angular/core';
import { Menu } from '../../../utility/interfaces/gen-interface';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [MatExpansionModule, CommonModule, RouterModule],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
	menuList = signal<Menu[]>([]);

	constructor(private router: Router) {
		this.router.events
			.pipe(
				filter((event): event is NavigationEnd => event instanceof NavigationEnd)
			)
			.subscribe(event => {
				this.updateActiveByUrl(event.urlAfterRedirects);
			});
	}


	collapsed = false;

	toggleSidebar(): void {
		this.collapsed = !this.collapsed;
	}
	ngOnInit(): void {
		const menus: Menu[] = [
			{
				icon: 'fa-solid fa-chart-line',
				name: 'dashboard',
				label: 'Dashboard',
				href: '/admin/dashboard',
				subMenu: [],
				status: false
			},
			{
				icon: 'fa-regular fa-id-card',
				name: 'Employee',
				label: 'Employees',
				href: '/admin/employee/list',
				subMenu: [],
				status: false
			},
			{
				icon: "fa-solid fa-kitchen-set",
				name: "cloud-kitchens",
				label: "Cloud Kitchens",
				href: "/admin/cloud-kitchen/list",
				subMenu: [],
				status: false
			},
			{
				icon: "fa-solid fa-people-group",
				// icon: "fa-solid fa-people-line",
				name: "subscribers",
				label: "Subscribers",
				href: "/admin/subscriber/list",
				subMenu: [],
				status: false
			},
			{
				icon: "fa-solid fa-gift",
				name: "coupons",
				label: "Coupons",
				href: "/admin/coupon/list",
				subMenu: [],
				status: false
			}
			// other menus...
		];
		this.menuList.set(menus);
		this.updateActiveByUrl(this.router.url);
	}

	updateActiveByUrl(url: string): void {
		// strip query + fragment so /admin/dashboard?page=1 still matches /admin/dashboard
		const cleanUrl = url.split('?')[0].split('#')[0];

		const menus = this.menuList().map(menu => {
			let isParentActive = false;

			if (!menu.subMenu || menu.subMenu.length === 0) {
				// direct menu: active if path matches
				menu.status = cleanUrl === menu.href;
			} else {
				// submenu items
				menu.subMenu = menu.subMenu.map(sub => {
					const active = cleanUrl === sub.href;
					if (active) {
						isParentActive = true;
					}
					return { ...sub, status: active };
				});

				// parent open if any child active OR path starts with parent href
				menu.status = isParentActive || (menu.href !== '#' && cleanUrl.startsWith(menu.href));
			}

			return { ...menu };
		});

		this.menuList.set(menus);
	}


	// // parent "active" state (for li.active)
	// isParentActive(item: Menu): boolean {
	// 	return !!item.status || !!item.subMenu?.some(s => s.status);
	// }

	// parent "active" state (for li.active)
	isParentActive(item: Menu): boolean {
		// active ONLY if any child is active
		return !!item.subMenu?.some(s => s.status);
	}

	// open/close parent submenu
	toggleStatus(index: number): void {
		const menus = [...this.menuList()];
		const item = menus[index];
		if (!item.subMenu?.length) return;
		item.status = !item.status; // controls open/close
		this.menuList.set(menus);
	}

	// activate a specific child and open parent
	setSubStatus(parentIndex: number, subIndex: number): void {
		const menus = [...this.menuList()];
		const parent = menus[parentIndex];

		parent.subMenu = parent.subMenu.map((s, i) => ({
			...s,
			status: i === subIndex
		}));
		parent.status = true; // open parent if clicked

		this.menuList.set(menus);
	}
}