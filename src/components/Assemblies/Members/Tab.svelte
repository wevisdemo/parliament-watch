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
	class="member-tab sticky top-0 z-10 bg-ui-01 px-4 transition-[top] duration-[350ms] will-change-[top] md:px-16"
>
	<h2 class="label-01 py-2 pl-4 text-gray-60">แบ่งตาม</h2>
	<menu class="flex overflow-x-auto">
		{#each groupByTabs as { label, path, isActive } (path)}
			<li
				class={twMerge(
					'body-compact-01 flex h-12 border-r border-solid border-ui-04 last:border-r-0',
					isActive
						? 'border-y-2 border-solid border-b-white border-t-blue-60 bg-white font-semibold text-gray-100'
						: 'bg-ui-03 text-gray-60'
				)}
			>
				<a
					class="flex items-center whitespace-nowrap px-4 text-[inherit]"
					href="/assemblies/{assembly.id}/members/{path}"
					data-sveltekit-reload
				>
					{label}
				</a>
			</li>
		{/each}
	</menu>
</nav>
