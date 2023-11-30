<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import { Accordion, AccordionItem, Checkbox, FormGroup, Search } from 'carbon-components-svelte';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';

	export let data;
	$: ({ groups, groupByTabs } = data);
	$: currentPath = groupByTabs.find((e) => e.isActive)?.path ?? '';

	let แบ่งเขต = true;
	let บัญชีรายชื่อ = true;

	export let searchQuery = '';
	let mounted = false;
	let currentCatg = '';
	onMount(() => {
		mounted = true;

		if (window.matchMedia('(min-width: 672px)').matches) {
			currentCatg = (
				groups[0].name +
				'-' +
				('subgroups' in groups[0] ? groups[0].subgroups[0].name : '')
			).replace(/ /g, '-');

			const scroller = scrollama();

			scroller
				.setup({
					step: '.subcategory',
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '80px'
				})
				.onStepEnter((response) => {
					currentCatg = response.element.children[0].id;
					console.log(currentCatg);
				});

			return scroller.destroy;
		}
	});
</script>

<div class="flex">
	<aside
		class="flex-none flex flex-col gap-4 w-[250px] sticky top-[80px] h-[calc(100dvh-80px)] px-6"
	>
		<div class="flex">
			<Search
				class="flex-1 {!mounted ? '-mt-6' : ''}"
				placeholder="ค้นหาชื่อบุคคล"
				light
				bind:value={searchQuery}
				skeleton={!mounted}
			/>
		</div>
		{#if currentPath === 'party'}
			<FormGroup legendText="ประเภท" noMargin>
				<div class="flex items-center justify-between">
					<Checkbox labelText="แบ่งเขต" class="!m-0" bind:checked={แบ่งเขต} skeleton={!mounted} />
					<Checkbox
						labelText="บัญชีรายชื่อ"
						class="!m-0"
						bind:checked={บัญชีรายชื่อ}
						skeleton={!mounted}
					/>
				</div>
			</FormGroup>
		{/if}
		<div class="flex-[1_1_auto] h-0 overflow-y-auto">
			<Accordion class="accordion-content-full" skeleton={!mounted}>
				{#each groups as group, idx (group.name)}
					<AccordionItem open={idx === 0}>
						<span slot="title" class="font-semibold"
							>{group.name}
							{#if !['party', 'province'].includes(currentPath) && 'subgroups' in group}
								<span class="font-normal text-gray-60"
									>({group.subgroups.map((e) => e.members.length).reduce((a, c) => a + c)})</span
								>
							{/if}
						</span>
						{#if 'subgroups' in group}
							<ul class="flex flex-col">
								{#each group.subgroups as { name, members, icon } (name)}
									<li class="border-b border-b-solid border-b-gray-30 last:border-none">
										<a
											href="#{group.name.replace(/ /g, '-')}-{name.replace(/ /g, '-')}"
											class="flex items-center gap-2 body-01 text-gray-100 py-2 px-4 hover:bg-ui-03"
											class:font-semibold={currentCatg ===
												(group.name + '-' + name).replace(/ /g, '-')}
										>
											{#if icon}
												<img
													src={icon}
													alt=""
													width="16"
													height="16"
													class="aspect-square object-cover border border-solid border-gray-30 rounded-full bg-white"
												/>
											{/if}
											<span class="mr-auto">
												{name}
											</span>
											<span class="text-gray-60">{members.length}</span>
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	</aside>
	<div class="p-4 text-gray-100 flex flex-col gap-4">
		{#each groups as group (group.name)}
			<section>
				<h2 class="py-[6px] text-gray-60 fluid-heading-04">{group.name}</h2>
				{#if 'subgroups' in group}
					{#each group.subgroups as { name: sgroup_name, members } (sgroup_name)}
						<article class="subcategory">
							<h3
								id="{group.name.replace(/ /g, '-')}-{sgroup_name.replace(/ /g, '-')}"
								class="flex items-baseline gap-2 p-4 mb-2 border-b border-solid border-b-gray-30 heading-compact-02 font-semibold"
							>
								{sgroup_name}
								<span class="body-01 text-gray-60"
									>{members.length} {currentPath === 'province' ? 'เขต' : 'คน'}</span
								>
							</h3>
							<div class="flex gap-y-2 flex-wrap">
								{#each members as { id, avatar, firstname, lastname, role, isActive, party }, idx (id + idx)}
									<PoliticianProfile
										{id}
										{avatar}
										{firstname}
										{lastname}
										{role}
										{isActive}
										{party}
									/>
								{/each}
							</div>
						</article>
					{/each}
				{/if}
			</section>
		{/each}
	</div>
</div>

<style>
	.subcategory > h3 {
		scroll-margin-top: 80px;
	}
</style>
