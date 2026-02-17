import {
	Component,
	OnDestroy,
	OnInit,
	AfterViewInit,
	signal,
	ViewChild,
	ElementRef,
	Inject,
	HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Menu } from '../../../utility/interfaces/gen-interface';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [MatExpansionModule, CommonModule, RouterModule],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
	menuList = signal<Menu[]>([]);
	collapsed = false;

	private readonly STORAGE_KEY = 'sidebar-collapsed';
	private readonly THEME_KEY = 'theme';
	private destroy$ = new Subject<void>();

	@ViewChild('searchForm', { static: false }) searchForm!: ElementRef<HTMLFormElement>;
	@ViewChild('themeIcon', { static: false }) themeIconEl!: ElementRef<HTMLElement>;
	@ViewChild('themeToggleBtn', { static: false }) themeToggleBtn!: ElementRef<HTMLButtonElement>;

	constructor(
		private router: Router,
		@Inject(DOCUMENT) private document: Document
	) { }

	// ---------- LIFECYCLE ----------

	ngOnInit(): void {
		// 1) collapsed from localStorage
		this.collapsed = this.getCollapsedState();

		// 2) init theme (html data-bs-theme)
		this.initTheme();

		// 3) menu data
		const menus: Menu[] = [
			{
				icon: 'dashboard',
				name: 'dashboard',
				label: 'Dashboard',
				href: '/admin/dashboard',
				subMenu: [],
				status: false
			},
			{
				icon: 'kitchen',
				name: 'cloud-kitchens',
				label: 'Cloud Kitchens',
				href: '/admin/cloud-kitchen/list',
				subMenu: [],
				status: false
			},
			{
				icon: 'badge',
				name: 'Employee',
				label: 'Employees',
				href: '/admin/employee/list',
				subMenu: [],
				status: false
			},
			{
				icon: 'diversity_4',
				name: 'subscribers',
				label: 'Subscribers',
				href: '/admin/subscriber/list',
				subMenu: [],
				status: false
			},
			{
				icon: 'local_activity',
				name: 'coupons',
				label: 'Coupons',
				href: '/admin/coupon/list',
				subMenu: [],
				status: false
			}
		];

		this.menuList.set(menus);
		this.updateActiveByUrl(this.router.url);

		// 4) router events
		this.router.events
			.pipe(
				filter((event): event is NavigationEnd => event instanceof NavigationEnd),
				takeUntil(this.destroy$)
			)
			.subscribe(event => this.updateActiveByUrl(event.urlAfterRedirects));

		// 5) auto-expand on large screens
		this.applyLargeScreenDefault();
	}

	ngAfterViewInit(): void {
		// ViewChild is ready; ensure icon matches theme + collapsed
		this.updateThemeIcon();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	@HostListener('window:resize')
	onResize(): void {
		// this.applyLargeScreenDefault();
	}

	// ---------- SIDEBAR COLLAPSE ----------

	toggleSidebar(): void {
		this.collapsed = !this.collapsed;
		this.setCollapsedState(this.collapsed);
		this.updateThemeIcon();
	}

	private applyLargeScreenDefault(): void {
		if (window.innerWidth > 768) {
			this.collapsed = false;
			this.setCollapsedState(false);
			this.updateThemeIcon();
		}
	}

	private getCollapsedState(): boolean {
		try {
			const raw = localStorage.getItem(this.STORAGE_KEY);
			return raw ? JSON.parse(raw) : false;
		} catch {
			return false;
		}
	}

	private setCollapsedState(collapsed: boolean): void {
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collapsed));
		} catch {
			console.warn('localStorage unavailable');
		}
	}

	// Expand sidebar when search clicked
	onSearchClick(): void {
		if (this.collapsed) {
			this.collapsed = false;
			this.setCollapsedState(false);
			this.updateThemeIcon();
		}
		const input = this.searchForm?.nativeElement.querySelector('input');
		input?.focus();
	}

	// ---------- THEME LOGIC (data-bs-theme on <html>) ----------

	private initTheme(): void {
		const savedTheme = localStorage.getItem(this.THEME_KEY);
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		const initialTheme: 'light' | 'dark' =
			savedTheme === 'dark'
				? 'dark'
				: savedTheme === 'light'
					? 'light'
					: systemPrefersDark
						? 'dark'
						: 'light';

		this.setHtmlTheme(initialTheme);
	}

	private setHtmlTheme(theme: 'light' | 'dark'): void {
		const htmlEl = this.document.documentElement; // <html>
		htmlEl.setAttribute('data-bs-theme', theme);
		localStorage.setItem(this.THEME_KEY, theme);
	}

	private getHtmlTheme(): 'light' | 'dark' {
		const htmlEl = this.document.documentElement;
		return (htmlEl.getAttribute('data-bs-theme') as 'light' | 'dark') || 'light';
	}

	toggleTheme(): void {
		const current = this.getHtmlTheme();
		const next: 'light' | 'dark' = current === 'dark' ? 'light' : 'dark';
		this.setHtmlTheme(next);
		this.updateThemeIcon();
	}

	private isDarkTheme(): boolean {
		return this.getHtmlTheme() === 'dark';
	}

	private updateThemeIcon(): void {
		if (!this.themeIconEl) return; // ViewChild not ready (before AfterViewInit)
		const isDark = this.isDarkTheme();
		const el = this.themeIconEl.nativeElement;

		// collapsed ? (isDark ? "light_mode" : "dark_mode") : "dark_mode";
		el.textContent = this.collapsed
			? (isDark ? 'light_mode' : 'dark_mode')
			: 'dark_mode';
	}

	// ---------- MENUS / ACTIVE ----------

	updateActiveByUrl(url: string): void {
		const cleanUrl = url.split('?')[0].split('#')[0];

		const menus = this.menuList().map(menu => {
			let isParentActive = false;

			if (!menu.subMenu || menu.subMenu.length === 0) {
				menu.status = cleanUrl === menu.href;
			} else {
				menu.subMenu = menu.subMenu.map(sub => {
					const active = cleanUrl === sub.href;
					if (active) {
						isParentActive = true;
					}
					return { ...sub, status: active };
				});

				menu.status = isParentActive || (menu.href !== '#' && cleanUrl.startsWith(menu.href));
			}

			return { ...menu };
		});

		this.menuList.set(menus);
	}

	isParentActive(item: Menu): boolean {
		return !!item.subMenu?.some(s => s.status);
	}

	toggleStatus(index: number): void {
		const menus = [...this.menuList()];
		const item = menus[index];
		if (!item.subMenu?.length) return;
		item.status = !item.status;
		this.menuList.set(menus);
	}

	setSubStatus(parentIndex: number, subIndex: number): void {
		const menus = [...this.menuList()];
		const parent = menus[parentIndex];

		parent.subMenu = parent.subMenu.map((s, i) => ({
			...s,
			status: i === subIndex
		}));
		parent.status = true;

		this.menuList.set(menus);
	}
}
