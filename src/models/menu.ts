import type { ComponentType } from 'svelte';

export enum MenuTypes {
	root = 'root',
	link = 'link',
	both = 'both'
}

export interface Menu {
	label: string;
	icon?: ComponentType | null;
	url?: string;
	type: MenuTypes;
	subs?: Menu[];
}
