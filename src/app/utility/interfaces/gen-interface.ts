
export interface Item {
	id: number;
	name: string;
	image_url: string;
	description: string;
	food_class: string; // 'VEGAN' | 'VEG' | 'NON_VEG'
	address: string;
	base_price: number;
	rating: number;
}
