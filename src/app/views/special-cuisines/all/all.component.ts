import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from "../../../utility/item-list/item-list.component";

@Component({
	selector: 'app-all',
	standalone: true,
	imports: [CommonModule, ItemListComponent],
	templateUrl: './all.component.html',
	styleUrl: './all.component.scss'
})
export class AllComponent {
	listApi = "/assets/jsons/all-special-cuisine.json";
	viewAllRouteLink = "/special-cuisines/region";
}