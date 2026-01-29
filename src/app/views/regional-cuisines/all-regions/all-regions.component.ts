import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from "../../../utility/item-list/item-list.component";

@Component({
	selector: 'app-all-regions',
	standalone: true,
	imports: [CommonModule, ItemListComponent],
	templateUrl: './all-regions.component.html',
	styleUrl: './all-regions.component.scss'
})
export class AllRegionsComponent {
	listApi = "/assets/jsons/all-region-cuisines.json";
	viewAllRouteLink = "/regional-cuisines/type";
}
