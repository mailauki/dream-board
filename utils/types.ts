import { UUID } from "crypto";

export interface DreamItem {
	id: number,
	created_at?: Date,
	url: string,
	user_id: UUID | string,
	title?: string,
	description?: string,
	price_amount?: number,
	price_currency?: string,
}

export interface Tags { [key: string]: string | string[] | undefined }

export interface MetaTags {
	title: string,
	description: string,
	image: string,
	price: string,
	currency: string,
	baseURL: string,
}