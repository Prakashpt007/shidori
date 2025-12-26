import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly locationConfirmation = viewChild.required<ElementRef>("locationConfirmation");
  private modalService = inject(NgbModal);


  getLocationInfo() {
    this.modalService.open(this.locationConfirmation(), {
      size: 'lg', scrollable: true, centered: false, backdrop: 'static'
    }).result.then(
      () => {

      },
      () => { }
    );
  }
}
