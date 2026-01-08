import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HomePageCuisineCategoryList } from '../../../utility/interfaces/sliderItem-interface';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../../services/generic-http.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-regional-cuisines-section',
	standalone: true,
	imports: [CarouselModule, RouterLink],
	templateUrl: './regional-cuisines-section.component.html',
	styleUrl: './regional-cuisines-section.component.scss'
})
export class RegionalCuisinesSectionComponent {

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

	regionLink = "/regional-cuisines/region";

	listApi = "/assets/jsons/regional-cuisine-list.json";

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




// North India

//   Punjabi Cuisine

//   Kashmiri Cuisine

//   Awadhi (Lucknowi) Cuisine

//   Mughlai Cuisine

//   Rajasthani Cuisine

//   Himachali Cuisine

//   Pahadi Cuisine

// West India

//   Gujarati Cuisine

//   Maharashtrian Cuisine

//   Goan Cuisine

//   Konkani Cuisine

//   Rajasthani Cuisine

//   Malvani Cuisine

// South India

//   Tamil Nadu Cuisine

//   Andhra Cuisine

//   Telangana Cuisine

//   Karnataka (Udupi) Cuisine

//   Kerala Cuisine

//   Chettinad Cuisine

// East India

//   Bengali Cuisine

//   Odia (Odia/Oriya) Cuisine

//   Assamese Cuisine

//   Bihari Cuisine

// Central India

//   Madhya Pradesh Cuisine

//   Chhattisgarhi Cuisine

// North-East India

//   Naga Cuisine

//   Manipuri Cuisine

//   Mizo Cuisine

//   Tripuri Cuisine

//   Arunachali Cuisine

//   Sikkimese Cuisine



// 1	  JAMMU AND KASHMIR
// 2	  HIMACHAL PRADESH
// 3	  PUNJAB
// 4	  CHANDIGARH
// 5	  UTTARAKHAND
// 6	  HARYANA
// 7	  DELHI
// 8	  RAJASTHAN
// 9	  UTTAR PRADESH
// 10	BIHAR
// 11	SIKKIM
// 12	ARUNACHAL PRADESH
// 13	NAGALAND
// 14	MANIPUR
// 15	MIZORAM
// 16	TRIPURA
// 17	MEGHALAYA
// 18	ASSAM
// 19	WEST BENGAL
// 20	JHARKHAND
// 21	ORISSA
// 22	CHHATTISGARH
// 23	MADHYA PRADESH
// 24	GUJARAT
// 26	DADRA AND NAGAR HAVELI & DAMAN AND DIU
// 27	MAHARASHTRA
// 29	KARNATAKA
// 30	GOA
// 31	LAKSHADWEEP
// 32	KERALA
// 33	TAMIL NADU
// 34	PUDUCHERRY
// 35	ANDAMAN AND NICOBAR
// 36	TELANGANA
// 37	ANDHRA PRADESH
// 38	LADAKH