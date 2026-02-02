import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScrollerBarListComponent } from '../../../utility/scroller-bar-list/scroller-bar-list.component';
import { GenericHttpService } from '../../../services/generic-http.service';
import { TemplateFilterComponent } from "../../../utility/template-filter/template-filter.component";

@Component({
	selector: 'app-template',
	standalone: true,
	imports: [CommonModule, RouterModule, ScrollerBarListComponent, TemplateFilterComponent],
	templateUrl: './template.component.html',
	styleUrl: './template.component.scss'
})
export class TemplateComponent {

	regionalCuisineList = signal<any[]>([]);
	regionLink = "/special-cuisines/type";

	listApi = "/assets/jsons/special-cuisine-list.json";

	toastr = inject(ToastrService);
	genericHttp = inject(GenericHttpService);

	constructor() {

		this.genericHttp.getDataUsingURL(this.listApi).subscribe({
			next: (response: any) => {
				if (response.success == 200 || response.success == true) {

					this.regionalCuisineList.set(response.data);
				} else {
					this.toastr.error(response.message, response.status);
				}

			},
			error: (err: any) => {
				this.toastr.error(err.message, err.status);

			},
			complete: () => {
				// console.log('completed');

			}
		});
	}
}
