import type { Component } from 'svelte';

export enum MenuTypes {
	root = 'root',
	link = 'link',
	both = 'both'
}

export interface Menu {
	label: string;
	icon?: Component<Record<string, unknown>> | null;
	url?: string;
	type: MenuTypes;
	subs?: Menu[];
}
