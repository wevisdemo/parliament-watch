import type GeneralIcon from '$components/icons/GeneralIcon.svelte';
import type LawIcon from '$components/icons/LawIcon.svelte';
import type MobileRotateIcon from '$components/icons/MobileRotateIcon.svelte';
import type PeopleIcon from '$components/icons/PeopleIcon.svelte';
import type PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
import type VoteIcon from '$components/icons/VoteIcon.svelte';
import type WeVisIcon from '$components/icons/WeVisIcon.svelte';

export interface Menu {
	label: string;
	icon?:
		| typeof GeneralIcon
		| typeof LawIcon
		| typeof MobileRotateIcon
		| typeof PeopleIcon
		| typeof PoliticianIcon
		| typeof VoteIcon
		| typeof WeVisIcon
		| null;
	url: string | null;
	subs?: Menu[];
}
