<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type {
		AssemblySummary,
		GroupByTab
	} from '../../../routes/assemblies/[id]/members/[groupby]/+layout.server';

	export let data: {
		assembly: AssemblySummary;
		groupByTabs: GroupByTab[];
	};

	$: ({ assembly, groupByTabs } = data);
</script>

<nav
	class="px-4 bg-ui-01 md:px-16 sticky top-0 z-10 member-tab transition-[top] will-change-[top] duration-[350ms]"
>
	<h2 class="pl-4 py-2 text-gray-60 label-01">แบ่งตาม</h2>
	<menu class="flex overflow-x-auto">
		{#each groupByTabs as { label, path, isActive } (path)}
			<li
				class={twMerge(
					'flex body-compact-01 h-12 border-r border-solid border-ui-04 last:border-r-0',
					isActive
						? 'bg-white font-semibold text-gray-100 border-y-2 border-solid border-t-blue-60 border-b-white'
						: 'bg-ui-03 text-gray-60'
				)}
			>
				<a
					class="flex items-center px-4 text-[inherit] whitespace-nowrap"
					href="/assemblies/{assembly.id}/members/{path}"
					data-sveltekit-reload
				>
					{label}
				</a>
			</li>
		{/each}
	</menu>
</nav>
