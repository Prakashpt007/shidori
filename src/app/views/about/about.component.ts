import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';

@Component({
	selector: 'app-about',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './about.component.html',
	styleUrl: './about.component.scss'
})
export class AboutComponent {

	@ViewChild('carousel', { static: false })
	carousel!: ElementRef<HTMLElement>;

	@ViewChildren('card')
	cards!: QueryList<ElementRef<HTMLElement>>;

	currentIndex = 0;

	items = signal<any[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

	ngAfterViewInit(): void {
		// ensure index stays valid if cards change
		this.cards.changes.subscribe(() => {
			this.currentIndex = Math.min(this.currentIndex, this.cards.length - 1);
		});
	}

	scrollNext(): void {
		if (this.currentIndex < this.cards.length - 1) {
			this.currentIndex++;
			this.scrollToCurrent();
		}
	}

	scrollPrev(): void {
		if (this.currentIndex > 0) {
			this.currentIndex--;
			this.scrollToCurrent();
		}
	}

	private scrollToCurrent(): void {
		const card = this.cards.get(this.currentIndex);
		card?.nativeElement.scrollIntoView({
			behavior: 'smooth',
			inline: 'start',
			block: 'nearest'
		});
	}
}
