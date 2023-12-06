<script lang="ts">
	import Header from '$components/Assemblies/Members/Header.svelte';
	import Tab from '$components/Assemblies/Members/Tab.svelte';
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import {
		Accordion,
		AccordionItem,
		Button,
		Checkbox,
		FormGroup,
		Search
	} from 'carbon-components-svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import SearchLocate from 'carbon-icons-svelte/lib/SearchLocate.svelte';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';
	import type { PoliticianGroupBy } from './+page.js';

	export let data;
	$: ({ groups, groupByTabs } = data);
	$: currentPath = groupByTabs.find((e) => e.isActive)?.path ?? '';

	let showFilter = true;
	let searchQuery = '';
	let isByDistrict = true;
	let isByPartylist = true;

	$: formattedSearchQuery = searchQuery.trim();
	$: filteredGroup =
		formattedSearchQuery === '' && isByDistrict && isByPartylist
			? groups
			: (groups.map((group) => {
					if ('subgroups' in group) {
						return {
							...group,
							subgroups: group.subgroups.map((subgroup) => {
								return {
									...subgroup,
									members: subgroup.members.filter((member) => {
										return (
											(member.firstname + ' ' + member.lastname).includes(formattedSearchQuery) &&
											((isByDistrict && member.candidateType === 'แบ่งเขต') ||
												(isByPartylist && member.candidateType === 'บัญชีรายชื่อ'))
										);
									})
								};
							})
						};
					}
					return group.name.includes(formattedSearchQuery);
			  }) as PoliticianGroupBy);

	let isMobile = false;
	let mounted = false;
	let currentCatg = '';
	onMount(() => {
		mounted = true;

		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
		isMobile = !showFilter;
		if (showFilter) {
			currentCatg = (
				groups[0].name +
				'-' +
				('subgroups' in groups[0] ? groups[0].subgroups[0].name : '')
			).replace(/ /g, '-');

			const scroller = scrollama();

			scroller
				.setup({
					step: '.member-subcategory',
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '128px'
				})
				.onStepEnter((response) => {
					currentCatg = response.element.children[0].id;
				});

			return scroller.destroy;
		}
	});
</script>

<Header {data} bind:searchQuery {mounted} />
<Tab {data} />
<div class="relative flex">
	{#if showFilter}
		<aside
			class={[
				'flex flex-col gap-4 px-6 bg-white',
				'fixed left-0 right-0 top-0 bottom-0 z-40',
				'md:sticky md:top-[80px] md:w-[250px] md:h-[calc(100dvh-80px)] md:flex-none md:z-0',
				'member-aside'
			].join(' ')}
		>
			<div class="flex -mr-6 md:mr-0">
				<Search
					class="flex-1 {!mounted ? '-mt-6' : ''}"
					placeholder="ค้นหาชื่อบุคคล"
					light
					bind:value={searchQuery}
					skeleton={!mounted}
				/>
				<div class="md:hidden flex">
					<Button
						kind="ghost"
						icon={Minimize}
						iconDescription="ซ่อนตัวเลือก"
						tooltipPosition="right"
						tooltipAlignment="end"
						on:click={() => {
							showFilter = false;
						}}
						skeleton={!mounted}
					/>
				</div>
			</div>
			{#if currentPath === 'party'}
				<FormGroup legendText="ประเภท" noMargin>
					<div class="flex items-center justify-between overflow-hidden">
						<Checkbox
							labelText="แบ่งเขต"
							class="!m-0"
							bind:checked={isByDistrict}
							skeleton={!mounted}
						/>
						<Checkbox
							labelText="บัญชีรายชื่อ"
							class="!m-0"
							bind:checked={isByPartylist}
							skeleton={!mounted}
						/>
					</div>
				</FormGroup>
			{/if}
			<div class="flex-[1_1_auto] h-0 overflow-y-auto">
				<Accordion class="accordion-content-full" skeleton={!mounted}>
					{#each filteredGroup as group (group.name)}
						<AccordionItem open={currentPath === 'party'}>
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
												on:click={() => {
													isMobile && (showFilter = false);
												}}
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
	{/if}
	<div class="flex-1 p-4 text-gray-100 flex flex-col gap-4">
		{#each filteredGroup as group (group.name)}
			<section>
				<h2 class="py-[6px] text-gray-60 fluid-heading-04">{group.name}</h2>
				{#if 'subgroups' in group}
					{#each group.subgroups as { name: sgroup_name, members } (sgroup_name)}
						<article class="member-subcategory">
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
<div class="flex-none sticky bottom-0 md:hidden">
	{#if !showFilter}
		<Button
			class="m-4"
			tooltipAlignment="start"
			tooltipPosition="top"
			iconDescription="แสดงตัวเลือก"
			icon={SearchLocate}
			kind="primary"
			on:click={() => {
				showFilter = true;
			}}
			skeleton={!mounted}
		/>
	{/if}
</div>

<style>
	.member-subcategory > h3 {
		scroll-margin-top: 128px;
	}
</style>
