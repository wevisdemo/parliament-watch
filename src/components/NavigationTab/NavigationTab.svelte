<script lang="ts">
	type AlignSide = 'left' | 'center' | 'right';

	interface Tab {
		id: string;
		label: string;
		disabled?: boolean;
		show?: number | boolean;
	}

	export let tabs: Tab[];
	export let align: AlignSide = 'left';

	let activeTab: string;

	const alignMapping = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	};

	$: {
		if (tabs.length) {
			activeTab = tabs[0].id;
		}
	}

	const onClickTab = (tab: string) => {
		document.getElementById(tab)?.scrollIntoView({
			behavior: 'smooth'
		});
		activeTab = tab;
	};
</script>

<div class="flex w-full">
	{#each tabs.filter((tab) => tab.show) as { id, label, disabled } (id)}
		<button
			class="{alignMapping[align]} {activeTab === id ? 'tab-active' : 'tab-inactive'}"
			on:click={() => onClickTab(id)}
			{disabled}
		>
			{label}
		</button>
	{/each}
</div>

<style lang="postcss">
	button {
		@apply w-full border-b-[2px] border-solid px-[16px] py-[11px] text-[14px];
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
