import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ScrollerBarListComponent } from '../../utility/scroller-bar-list/scroller-bar-list.component';
import { RouterModule } from '@angular/router';
import { GenericHttpService } from '../../services/generic-http.service';
import { ToastrService } from 'ngx-toastr';
import { GenFiltersComponent } from "../../utility/gen-filters/gen-filters.component";

@Component({
	selector: 'app-template',
	standalone: true,
	imports: [CommonModule, RouterModule, ScrollerBarListComponent],
	templateUrl: './template.component.html',
	styleUrl: './template.component.scss'
})
export class TemplateComponent {

	regionalCuisineList = signal<any[]>([]);
	regionLink = "/regional-cuisines/type";

	listApi = "/assets/jsons/regional-cuisine-list.json";

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