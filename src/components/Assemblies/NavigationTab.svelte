<script lang="ts">
	type TabId = 'summary' | 'members' | 'latest-votes' | 'role-change' | 'latest-bills';

	interface Tab {
		id: TabId;
		label: string;
		show?: number | boolean;
	}

	export let tabs: Tab[];

	let activeTab: TabId;

	$: {
		if (tabs.length) {
			activeTab = tabs[0].id;
		}
	}

	const onClickTab = (tab: TabId) => {
		document.getElementById(tab)?.scrollIntoView({
			behavior: 'smooth'
		});
		activeTab = tab;
	};
</script>

<div class="flex w-full">
	{#each tabs.filter((tab) => tab.show) as { id, label } (id)}
		<button
			class={activeTab === id ? 'tab-active' : 'tab-inactice'}
			on:click={() => onClickTab(id)}
		>
			{label}
		</button>
	{/each}
</div>

<style lang="postcss">
	button {
		@apply w-full border-b-[2px] border-solid px-[16px] py-[11px] text-left text-[14px];
	}

	.tab-active {
		@apply border-blue-60 font-semibold text-black;
	}

	.tab-inactice {
		@apply border-gray-20 text-gray-60;
	}
</style>
