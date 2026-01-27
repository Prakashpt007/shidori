import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollerBarListComponent } from '../../utility/scroller-bar-list/scroller-bar-list.component';

@Component({
	selector: 'app-template',
	standalone: true,
	imports: [CommonModule, RouterModule, ScrollerBarListComponent],
	templateUrl: './template.component.html',
	styleUrl: './template.component.scss'
})
export class TemplateComponent {
	regionLink = "/international-cuisines/type";
	regionalCuisineList = signal<any[]>([]);
	ngOnInit() {
		this.regionalCuisineList.update(prev => [
			...prev,

			{
				id: 1,
				image: 'assets/images/items/item-1.jpg',
				name: 'Italian'
			},
			{
				id: 2,
				image: 'assets/images/items/item-2.jpg',
				name: 'Chinese'
			},
			{
				id: 3,
				image: 'assets/images/items/item-3.jpg',
				name: 'Thai'
			},
			{
				id: 4,
				image: 'assets/images/items/item-4.jpg',
				name: 'Japanese'
			},
			{
				id: 5,
				image: 'assets/images/items/item-5.jpg',
				name: 'Korean'
			},
			{
				id: 6,
				image: 'assets/images/items/item-6.jpg',
				name: 'Middle Eastern'
			},
			{
				id: 7,
				image: 'assets/images/items/item-7.jpg',
				name: 'Mexican'
			},
			{
				id: 8,
				image: 'assets/images/items/item-8.jpg',
				name: 'American'
			},
			{
				id: 9,
				image: 'assets/images/items/item-9.jpg',
				name: 'French'
			},
			{
				id: 10,
				image: 'assets/images/items/item-10.jpg',
				name: 'Mediterranean'
			}
		]
		);
	}
}
