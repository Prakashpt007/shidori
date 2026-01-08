import { Component, inject, signal, ViewChild } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SliderItem } from '../../../utility/interfaces/sliderItem-interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../../services/generic-http.service';

@Component({
	selector: 'app-all-regions',
	standalone: true,
	imports: [CommonModule, CarouselModule, RouterLink],
	templateUrl: './all-regions.component.html',
	styleUrl: './all-regions.component.scss'
})
export class AllRegionsComponent {
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

	toastr = inject(ToastrService);
	genericHttp = inject(GenericHttpService);


	regionWiseCuisinesList = signal<any[]>([]);

	listApi = "/assets/jsons/all-international-cuisines.json";

	constructor() {

		this.genericHttp.getDataUsingURL(this.listApi).subscribe({
			next: (response: any) => {
				if (response.success == 200 || response.success == true) {

					this.regionWiseCuisinesList.set(response.data);
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

	getDiscountedPercentage(discountValue: number, basePrice: number): string {
		if (basePrice <= 0) return "0%";

		const percentage = (discountValue / basePrice) * 100;
		const capped = Math.min(Math.max(percentage, 0), 100);

		return `${Math.round(capped)}%`;
	}

	getDiscountedPrice(discountValue: number, basePrice: number): string {
		if (basePrice <= 0) return "0";

		const discountedPrice = basePrice - discountValue;
		const finalPrice = Math.max(discountedPrice, 0);

		return finalPrice.toFixed(2);
	}

}
