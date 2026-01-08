import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HomePageCuisineCategoryList } from '../../../utility/interfaces/sliderItem-interface';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../../services/generic-http.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-international-cuisines-section',
	standalone: true,
	imports: [CarouselModule, RouterLink],
	templateUrl: './international-cuisines-section.component.html',
	styleUrl: './international-cuisines-section.component.scss'
})
export class InternationalCuisinesSectionComponent {

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
		autoplay: false,
		autoplayTimeout: 5000,
		autoplaySpeed: 700,
		autoplayHoverPause: true,
		autoplayMouseleaveTimeout: 5000,
		center: true,        // keep active slide in visual center
		stagePadding: 25    // how much of side items you want visible
	};



	sliderData = signal<HomePageCuisineCategoryList[]>([]);
	isDragging: WritableSignal<boolean> = signal(false);



	regionLink = "/international-cuisines/region";

	listApi = "/assets/jsons/international-cuisine-list.json";

	toastr = inject(ToastrService);
	genericHttp = inject(GenericHttpService);

	constructor() {

		this.genericHttp.getDataUsingURL(this.listApi).subscribe({
			next: (response: any) => {
				if (response.success == 200 || response.success == true) {

					this.sliderData.set(response.data);
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