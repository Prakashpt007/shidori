import { Component, signal, ViewChild } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SliderItem } from '../../../utility/interfaces/sliderItem-interface';

@Component({
	selector: 'app-recommendation-section',
	standalone: true,
	imports: [CarouselModule],
	templateUrl: './recommendation-section.component.html',
	styleUrl: './recommendation-section.component.scss'
})
export class RecommendationSectionComponent {
	@ViewChild('owlCarousel', { static: false })
	owlCarousel!: CarouselComponent;
	customOptions: OwlOptions = {
		loop: true,
		mouseDrag: true,
		touchDrag: true,
		pullDrag: false,
		dots: false,
		navSpeed: 700,
		nav: false,
		navText: ['<i class="fa-solid fa-angles-left"></i> Prev', 'Next <i class="fa-solid fa-angles-right"></i>'],

		autoWidth: true,
		margin: 24,
		autoplay: true,
		autoplayTimeout: 5000,
		autoplaySpeed: 700,
		autoplayHoverPause: true,
		autoplayMouseleaveTimeout: 5000,
		center: true,        // keep active slide in visual center
		stagePadding: 25    // how much of side items you want visible
	};



	sliderData = signal<SliderItem[]>([]);


	ngOnInit() {

		this.sliderData.update(prev => [
			...prev,
			{
				title: 'Item 1',
				image: 'assets/images/items/item-1.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			},
			{
				title: 'Item 2',
				image: 'assets/images/items/item-2.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			},
			{
				title: 'Item 3',
				image: 'assets/images/items/item-3.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			},
			{
				title: 'Item 4',
				image: 'assets/images/items/item-4.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			},
			{
				title: 'Item 5',
				image: 'assets/images/items/item-5.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			},
			{
				title: 'Item 6',
				image: 'assets/images/items/item-6.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			},
			{
				title: 'Item 7',
				image: 'assets/images/items/item-7.jpg',
				cuisines: "Bakery, Chinese, Sichuan",
				rating: "4.1",
				price: "₹300 for two",
				area: "Mankapur, Nagpur",
				distance: "4.6 km",
			}
		]);

	}

}
