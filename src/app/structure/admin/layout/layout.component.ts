import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'app-layout',
	standalone: true,
	imports: [RouterModule, SidebarComponent],
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss'
})
export class LayoutComponent {
	constructor(@Inject(DOCUMENT) private document: Document) { }

	ngOnInit() {
		this.loadAdminTheme();
	}

	ngOnDestroy() {
		const link = this.document.getElementById('admin-theme');
		link?.remove();
	}

	private loadAdminTheme() {
		let link = this.document.getElementById('admin-theme') as HTMLLinkElement;
		if (link) return;

		link = this.document.createElement('link');
		link.id = 'admin-theme';
		link.rel = 'stylesheet';
		link.href = '/admin-theme.css';  // Auto-served by ng serve
		this.document.head.appendChild(link);
	}
}
