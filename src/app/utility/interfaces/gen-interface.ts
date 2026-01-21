
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


export interface ItemDetails {
	id: number;
	name: string;
	image_url: string;
	description: string | null;
	food_class: string | null;
	address: string | null;
	base_price: number;
	rating: number | null;
	rating_count?: number | null;
	prep_time?: number | null;
}