<script lang="ts">
	import { Link, Tile } from 'carbon-components-svelte';
	import { Tag } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';

	import type { ComponentProps } from 'svelte';

	export let title: string;
	export let details: string;
	export let presentedBy: string[];
	export let consideredBy: string | [string, string];
	export let endorsedBy: string;
	export let stepDescription: string | undefined = undefined;
	export let steps: string[];
	export let examples: { link: string; description: string }[];

	let isOpen = false;

	function toggle(event: MouseEvent) {
		event.stopPropagation();
		isOpen = !isOpen;
	}

	let tagProps: ComponentProps<Tag> = {
		type: 'outline',
		size: 'sm',
		class: 'border-[1px]  bg-[transparent] line-clamp-1 leading-normal'
	};
</script>

<Tile
	on:click={toggle}
	class="bg-teal-10 border border-solid border-gray-30 p-0 hover:cursor-pointer {$$restProps.class}"
>
	<div class="p-5 flex flex-col gap-y-4">
		<h3 class="fluid-heading-03 mb-2">{title}</h3>
		<div class="flex flex-col gap-2">
			<p>{details}</p>
			<div class="flex flex-row items-center gap-1">
				<h4 class="font-semibold mr-1 shrink-0">เสนอโดย</h4>
				{#each presentedBy as presenter, idx}
					<div class="flex flex-row items-baseline after:content-['/'] last:after:content-none">
						<Tag {...tagProps}>{presenter}</Tag>
					</div>
				{/each}
			</div>
			<div class="flex flex-row items-center gap-1 overflow-hidden">
				<h4 class="font-semibold mr-1 shrink-0">พิจารณาโดย</h4>
				{#if Array.isArray(consideredBy)}
					<Tag {...tagProps}>{consideredBy[0]}</Tag>
					<ArrowRight />
					<Tag {...tagProps}>{consideredBy[1]}</Tag>
				{:else}
					<Tag {...tagProps}>{consideredBy}</Tag>
				{/if}
			</div>
			<div class="flex flex-row items-center gap-1">
				<h4 class="font-semibold mr-1 shrink-0">บังคับใช้เมื่อรับรองโดย</h4>
				<Tag {...tagProps}>{endorsedBy}</Tag>
			</div>
		</div>
		<div
			class=" grid transition-[grid-template-rows] {isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}"
		>
			<div class="flex flex-col overflow-hidden gap-y-4">
				<div>
					<h4 class="font-semibold leading-loose">ขั้นตอน</h4>
					{#if stepDescription}
						<p class="leading-snug">{stepDescription}</p>
					{/if}
				</div>
				<div class="flex flex-col gap-y-2">
					<span class="font-bold">เริ่มต้น</span>
					{#each steps as step}
						<div class="flex flex-row items-center gap-1">
							<CheckmarkFilled size={24} class="fill-green-70" />
							<hr class="w-3 width border-[1px]" />
							<Tag
								class="bg-text-primary text-ui-background font-semibold w-[364px] justify-start my-0"
								>{step}</Tag
							>
						</div>
					{/each}
					<span class="font-bold">สำเร็จ</span>
				</div>
				<div class="flex flex-col gap-1">
					<h4 class="font-semibold">ตัวอย่าง</h4>
					<ul class="list-inside list-disc leading-tight">
						{#each examples as example}
							<li>
								<Link inline href={example.link}>{example.description}</Link>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>

	<button
		on:click={toggle}
		class="w-full bg-[transparent] h-12 focus:outline-interactive-01 focus:outline-2 focus:-outline-offset-2"
	>
		<div class=" ml-auto my-auto w-12">
			<ChevronDown class="m-auto h-full {isOpen ? 'rotate-180' : ''}" />
		</div>
	</button>
</Tile>
