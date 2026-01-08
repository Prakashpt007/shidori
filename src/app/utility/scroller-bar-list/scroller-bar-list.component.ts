import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, InputSignal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-scroller-bar-list',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './scroller-bar-list.component.html',
	styleUrl: './scroller-bar-list.component.scss'
})
export class ScrollerBarListComponent {
	data: InputSignal<any[]> = input<any[]>([]);
	link: InputSignal<any> = input<any>("");

	childData = computed(() => this.data());

	@ViewChild('scrollContainer', { static: true })
	scrollContainer!: ElementRef<HTMLDivElement>;

	private isDown = false;
	private startX = 0;
	private scrollLeft = 0;
	private moved = false;
	private readonly dragThreshold = 5;
	private readonly wheelStep = 100; // adjust speed

	// drag handlers
	onMouseDown(event: MouseEvent) {
		this.isDown = true;
		this.moved = false;
		const container = this.scrollContainer.nativeElement;
		this.startX = event.pageX - container.offsetLeft;
		this.scrollLeft = container.scrollLeft;
	}

	onMouseLeave() {
		this.isDown = false;
	}

	onMouseUp() {
		this.isDown = false;
	}

	onMouseMove(event: MouseEvent) {
		if (!this.isDown) return;
		const container = this.scrollContainer.nativeElement;
		const x = event.pageX - container.offsetLeft;
		const walk = x - this.startX;

		if (Math.abs(walk) > this.dragThreshold) {
			this.moved = true;
		}

		container.scrollLeft = this.scrollLeft - walk;
	}

	// mouse wheel → horizontal scroll
	onWheel(event: WheelEvent) {
		const container = this.scrollContainer.nativeElement;

		// scroll horizontally using vertical delta
		container.scrollLeft += event.deltaY > 0 ? this.wheelStep : -this.wheelStep;

		// prevent page vertical scroll while over strip
		event.preventDefault();
	}

	onItemClick(event: MouseEvent, item: any) {
		if (this.moved) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		console.log('Clicked: ', item);
	}
}
