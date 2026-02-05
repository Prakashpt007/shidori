
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


interface Submenu {
	name: string,
	label: string,
	href: string,
	status: boolean
}

export interface Menu {
	icon: string,
	name: string,
	label: string,
	href: string,
	subMenu: Submenu[],
	status: boolean
}

export interface Employee {
	name: string;
	thumbnail: string;
	position: string;
	kitchen_id: string | number;
	emp_id: string | number;
	assigned: boolean;
	status: string;
}

export interface Kitchen {
	kitchen_id: string | number;
	state: string;
	city: string;
	pincode: number;
	assigned: boolean;
	status: string;
}