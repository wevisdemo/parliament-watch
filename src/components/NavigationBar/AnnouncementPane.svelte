<script lang="ts">
	import type { Announcement } from '$models/announcement';
	import InformationFilledIcon from 'carbon-icons-svelte/lib/InformationFilled.svelte';
	import HelpFilledIcon from 'carbon-icons-svelte/lib/HelpFilled.svelte';
	import WarningAltFilledIcon from 'carbon-icons-svelte/lib/WarningAltFilled.svelte';
	import CheckmarkFilledIcon from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';

	import { slide } from 'svelte/transition';

	export let announcement: Announcement;
	export let bgColor = 'bg-blue-60';
	export let iconType: 'info' | 'help' | 'warning' | 'success' = 'info';
	let isShown = true;
	const iconMap = {
		info: InformationFilledIcon,
		help: HelpFilledIcon,
		warning: WarningAltFilledIcon,
		success: CheckmarkFilledIcon
	};

	function dateStringBuilder(dateStart?: Date, dateEnd?: Date) {
		if (dateStart && dateEnd) {
			if (dateStart?.getTime() === dateEnd?.getTime()) {
				return dateConvertor(dateStart);
			}
			if (dateStart.getFullYear() == dateEnd.getFullYear()) {
				const thStartDate = dateConvertor(dateStart);
				const thStartDateArray = thStartDate.split(' ');
				return `${thStartDateArray[0]} ${thStartDateArray[1]} - ${dateConvertor(dateEnd)}`;
			}

			return `${dateConvertor(dateStart)} - ${dateConvertor(dateEnd)}`;
		} else if (dateStart) {
			return `${dateConvertor(dateStart)}`;
		} else if (dateEnd) {
			return `${dateConvertor(dateEnd)}`;
		} else {
			return '';
		}
	}

	function dateConvertor(date: Date) {
		const convertedDate = Intl.DateTimeFormat('th', {
			dateStyle: 'medium',
			calendar: 'buddhist'
		}).format(date);
		return convertedDate;
	}
</script>

{#if announcement && isShown}
	<div
		class="flex items-center fixed px-4 lg:px-10 w-screen text-white top-12 h-12 font-normal {bgColor}"
		transition:slide={{ duration: 350, axis: 'y' }}
	>
		<div class="flex items-center pr-4">
			<svelte:component this={iconMap[iconType]} size={20} />
		</div>
		<div class=" whitespace-nowrap overflow-hidden text-ellipsis">
			<span class="font-semibold">{announcement.title ?? ''}</span>
			<span>{announcement.text}</span>
			<span class="text-text-03"
				>{dateStringBuilder(announcement.dateStart, announcement.dateEnd)}</span
			>
		</div>
		<div class="ml-auto">
			{#if announcement.link}
				<a class="text-white whitespace-nowrap" href={announcement.link} aria-label="รายละเอียด"
					>รายละเอียด</a
				>
			{/if}
		</div>
		<div class="pl-4 lg:pl-8">
			<button
				class="flex bg-white/0 border-0 text-text-03 hover:text-white cursor-pointer"
				on:click={() => (isShown = false)}
				><CloseIcon size={24} />
			</button>
		</div>
	</div>
{/if}
