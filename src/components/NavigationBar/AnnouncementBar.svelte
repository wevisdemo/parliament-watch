<script lang="ts">
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
			'flex items-center fixed h-12 px-4 lg:px-10 w-screen text-white font-normal'
		)}
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
		<div class="ml-auto pl-8">
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
