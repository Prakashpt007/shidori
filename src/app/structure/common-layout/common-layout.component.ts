import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from "@angular/router";

@Component({
	selector: 'app-common-layout',
	standalone: true,
	imports: [HeaderComponent, FooterComponent, RouterModule],
	templateUrl: './common-layout.component.html',
	styleUrl: './common-layout.component.scss'
})
export class CommonLayoutComponent {

}
