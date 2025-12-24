<script lang="ts">
	import { formatThaiDate } from '$lib/date-parser';
	import type { Announcement } from '$models/announcement';
	import CheckmarkFilledIcon from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import HelpFilledIcon from 'carbon-icons-svelte/lib/HelpFilled.svelte';
	import InformationFilledIcon from 'carbon-icons-svelte/lib/InformationFilled.svelte';
	import WarningAltFilledIcon from 'carbon-icons-svelte/lib/WarningAltFilled.svelte';

	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	/** A announcement object.
	 * - title -- A title of announcement
	 * - text (Required) --  A text of announcement
	 * - dateStart --  A start date of announcement
	 * - dateEnd --  A end date of announcement
	 * - link --  A link of announcement
	 */
	export let announcement: Announcement;

	/** Boolean value that activate/deactivate function to hide a announcement pane on scrolling down
	 * - default value -- true
	 */
	export let hideOnScroll = true;

	/** A type of leading icon
	 * - "info" (default) -- InformationFilled Icon
	 * - "help" -- HelpFilled Icon
	 * - "warning" -- WarningAltFilled Icon
	 * - "success" -- CheckmarkFilled Icon
	 */
	let iconType = announcement.iconType ?? 'info';
	let isShown = true;
	let isScrollShown = true;
	let previousFromTop = 0;
	let topClass: 'top-12' | 'top-0' = 'top-12';
	const iconMap = {
		info: InformationFilledIcon,
		help: HelpFilledIcon,
		warning: WarningAltFilledIcon,
		success: CheckmarkFilledIcon
	};

	function dateStringBuilder(dateStart?: Date, dateEnd?: Date) {
		if (dateStart && dateEnd) {
			if (dateStart?.getTime() === dateEnd?.getTime()) {
				return formatThaiDate(dateStart);
			}
			if (dateStart.getFullYear() == dateEnd.getFullYear()) {
				const thStartDate = formatThaiDate(dateStart);
				const thStartDateArray = thStartDate.split(' ');
				return `${thStartDateArray[0]} ${thStartDateArray[1]} - ${formatThaiDate(dateEnd)}`;
			}

			return `${formatThaiDate(dateStart)} - ${formatThaiDate(dateEnd)}`;
		} else if (dateStart) {
			return `${formatThaiDate(dateStart)}`;
		} else if (dateEnd) {
			return `${formatThaiDate(dateEnd)}`;
		} else {
			return '';
		}
	}

	function scrollEventHandler(ev: Event) {
		const currentFromTop = window.scrollY;
		if (currentFromTop > previousFromTop) {
			//scrolling down
			if (hideOnScroll) {
				isScrollShown = false;
			} else {
				topClass = 'top-0';
			}
		} else {
			//scrolling up
			if (hideOnScroll) {
				isScrollShown = true;
			} else {
				topClass = 'top-12';
			}
		}
		previousFromTop = currentFromTop;
	}
</script>

<svelte:window on:scroll={scrollEventHandler} />
{#if announcement && isShown && isScrollShown}
	<div
		class={twMerge(
			topClass,
			announcement.bgColor ?? 'bg-blue-60',
			'fixed flex h-12 w-screen items-center px-4 font-normal text-white lg:px-10'
		)}
		transition:slide={{ duration: 350, axis: 'y' }}
	>
		<div class="flex items-center pr-4">
			<svelte:component this={iconMap[iconType]} size={20} />
		</div>
		<div class=" overflow-hidden text-ellipsis whitespace-nowrap">
			<span class="font-semibold">{announcement.title ?? ''}</span>
			<span>{announcement.text}</span>
			<span class="text-text-03"
				>{dateStringBuilder(announcement.dateStart, announcement.dateEnd)}</span
			>
		</div>
		<div class="ml-auto pl-8">
			{#if announcement.link}
				<a class="whitespace-nowrap text-white" href={announcement.link} aria-label="รายละเอียด"
					>รายละเอียด</a
				>
			{/if}
		</div>
		<div class="pl-4 lg:pl-8">
			<button
				class="flex cursor-pointer border-0 bg-white/0 text-text-03 hover:text-white"
				on:click={() => (isShown = false)}
				><CloseIcon size={24} />
			</button>
		</div>
	</div>
{/if}
