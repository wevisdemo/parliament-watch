<script lang="ts">
	type TabId =
		| 'summary' // for assemblies
		| 'members' // for assemblies
		| 'latest-votes' // for assemblies
		| 'role-change' // for assemblies
		| 'latest-bills' // for assemblies
		| 'status' // for bill
		| 'proposer' // for bill
		| 'party'; // for bill

	interface Tab {
		id: TabId;
		label: string;
		disabled?: boolean;
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
	{#each tabs.filter((tab) => tab.show) as { id, label, disabled } (id)}
		<button
			class={activeTab === id ? 'tab-active' : 'tab-inactive'}
			on:click={() => onClickTab(id)}
			{disabled}
		>
			{label}
		</button>
	{/each}
</div>

<style lang="postcss">
	button {
		@apply w-full border-b-[2px] border-solid px-[16px] py-[11px] text-left text-[14px];
	}

	button[disabled]:hover {
		@apply cursor-not-allowed;
	}

	.tab-active {
		@apply border-blue-60 font-semibold text-black;
	}

	.tab-inactive {
		@apply border-gray-20 text-gray-60;
	}
</style>
