import type { ComponentType } from 'svelte';

export interface Link {
	label: string;
	url: string;
	icon?: ComponentType;
}
