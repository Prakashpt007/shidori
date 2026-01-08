import { Component } from '@angular/core';

@Component({
  selector: 'app-our-featured-section',
  standalone: true,
  imports: [],
  templateUrl: './our-featured-section.component.html',
  styleUrl: './our-featured-section.component.scss'
})
export class OurFeaturedSectionComponent {

  items = [
    {
      title: 'Basic Plan-1',
      image: 'assets/images/items/item-1.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    },
    {
      title: 'Basic Plan-2',
      image: 'assets/images/items/item-2.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    },
    {
      title: 'Basic Plan-3',
      image: 'assets/images/items/item-3.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    },
    {
      title: 'Basic Plan-4',
      image: 'assets/images/items/item-4.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    },
    {
      title: 'Basic Plan-5',
      image: 'assets/images/items/item-5.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    },
    {
      title: 'Basic Plan-6',
      image: 'assets/images/items/item-6.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    },
    {
      title: 'Basic Plan-7',
      image: 'assets/images/items/item-7.jpg',
      cuisines: "Bakery, Chinese, Sichuan",
      rating: "4.1",
      price: "₹300 for two",
      area: "Mankapur, Nagpur",
      distance: "4.6 km",
    }
  ];

  currentIndex = 0;
  Math = Math;

  getVisibleItems() {
    const len = this.items.length;
    const visible = [];

    for (let offset = -2; offset <= 2; offset++) {
      const idx = (this.currentIndex + offset + len) % len;
      visible.push({
        item: this.items[idx],
        index: idx,
        offset
      });
    }
    return visible;
  }

  getTransform(offset: number): string {
    const spacing = 140;
    const xShift = offset * spacing;
    const scale = offset === 0 ? 1 : (offset === 1 || offset === -1 ? 0.82 : 0.7);
    const yShift = Math.abs(offset) * 20;

    return `translate(${xShift}px, ${yShift}px) scale(${scale}) rotateY(${-offset * 12}deg)`;
  }

  slideLeft() {
    const len = this.items.length;
    this.currentIndex = (this.currentIndex - 1 + len) % len;
  }

  slideRight() {
    const len = this.items.length;
    this.currentIndex = (this.currentIndex + 1) % len;
  }


  getOpacityFilter(offset: number): string {
    let brightness = 1;
    let grayscale = 0;

    if (offset === 0) {
      brightness = 1;
      grayscale = 0;
    } else if (offset === 1 || offset === -1) {
      brightness = 0.90;
      grayscale = 25;
    } else {
      brightness = 0.80;
      grayscale = 50;
    }

    return `brightness(${brightness}) grayscale(${grayscale}%)`;
  }


  // NEW: Jump to specific item
  goToItem(itemIndex: number) {
    // Only allow click if not already in center
    if (itemIndex !== this.currentIndex) {
      this.currentIndex = itemIndex;
    }
  }

}