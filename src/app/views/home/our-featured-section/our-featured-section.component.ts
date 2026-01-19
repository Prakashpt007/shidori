import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../../services/generic-http.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../../../utility/generic-list/generic-list.component';

@Component({
	selector: 'app-our-featured-section',
	standalone: true,
	imports: [CommonModule, GenericListComponent],
	templateUrl: './our-featured-section.component.html',
	styleUrl: './our-featured-section.component.scss'
})
export class OurFeaturedSectionComponent {


	private toastr = inject(ToastrService);
	private router = inject(Router);
	private genericHttp = inject(GenericHttpService);

	listApi = "/assets/jsons/our-featured-list.json";

	list = signal<any>([]);


	itemList = signal<any[]>([]);
	loadingData = signal<boolean>(false);
	errorMessage = signal<{ name: string, message: string } | null>(null);





}