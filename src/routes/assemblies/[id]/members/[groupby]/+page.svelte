<script lang="ts">
	import Header from '$components/Assemblies/Members/Header.svelte';
	import Tab from '$components/Assemblies/Members/Tab.svelte';
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';
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
	import type { PoliticianSummaryGroupBy } from './+page.server.js';
	import { GroupByOption } from '$models/assembly.js';

	export let data;
	$: ({ groups, groupByTabs, isDataHasSubgroup, availableAssemblies, isCabinet } = data);
	$: currentPath = groupByTabs.find(({ isActive }) => isActive)?.path ?? '';

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
											(formattedSearchQuery === '' ||
												(member.firstname + ' ' + member.lastname).includes(
													formattedSearchQuery
												)) &&
											((isByDistrict && member.candidateType === 'แบ่งเขต') ||
												(isByPartylist && member.candidateType === 'บัญชีรายชื่อ'))
										);
									})
								};
							})
						};
					}
					return {
						...group,
						members: group.members.filter((member) => {
							return (
								(formattedSearchQuery === '' ||
									(member.firstname + ' ' + member.lastname).includes(formattedSearchQuery)) &&
								((isByDistrict && member.candidateType === 'แบ่งเขต') ||
									(isByPartylist && member.candidateType === 'บัญชีรายชื่อ'))
							);
						})
					};
				}) as PoliticianSummaryGroupBy);

	const getSubgroupHeadingId = (group: { name: string }, name?: string) =>
		(name ? `${group.name}-${name}` : group.name).replaceAll(' ', '-');

	let memberListSectionRef: HTMLElement;

	let isMobile = false;
	let currentCategory = '';
	onMount(() => {
		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
		isMobile = !showFilter;
		if (showFilter) {
			currentCategory = getSubgroupHeadingId(
				groups[0],
				'subgroups' in groups[0] ? groups[0].subgroups[0].name : ''
			);

			const scroller = scrollama();

			scroller
				.setup({
					step: [
						...memberListSectionRef.getElementsByClassName('member-subcategory')
					] as HTMLElement[],
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '128px'
				})
				.onStepEnter((response) => {
					currentCategory = response.element.children[0].id;
				});

			return scroller.destroy;
		}
	});

	const roleAbbreviated = (role: string) => {
		return role
			.replace('รัฐมนตรีว่าการ', 'รมต.')
			.replace('รัฐมนตรีช่วยว่าการ', 'รมช.')
			.replace('รัฐมนตรีประจำ', 'รมต.ประจำ')
			.replace('รัฐมนตรีช่วยประจำ', 'รมช.ประจำ');
	};
</script>

<Header {data} bind:searchQuery {availableAssemblies} />
<Tab {data} />
<div class="relative flex">
	{#if showFilter}
		<aside
			class="member-aside fixed bottom-0 left-0 right-0 top-0 z-40 flex flex-col gap-4 bg-white px-6 md:sticky md:top-[80px] md:z-0 md:h-[calc(100dvh-80px)] md:w-[250px] md:flex-none"
		>
			<div class="-mr-6 flex md:mr-0">
				<Search class="flex-1" placeholder="ค้นหาชื่อบุคคล" light bind:value={searchQuery} />
				<div class="flex md:hidden">
					<Button
						kind="ghost"
						icon={Minimize}
						iconDescription="ซ่อนตัวเลือก"
						tooltipPosition="right"
						tooltipAlignment="end"
						on:click={() => {
							showFilter = false;
						}}
					/>
				</div>
			</div>
			{#if currentPath === GroupByOption.Party && !isCabinet}
				<FormGroup legendText="ประเภท" noMargin>
					<div class="flex items-center justify-between overflow-hidden">
						<Checkbox labelText="แบ่งเขต" class="!m-0" bind:checked={isByDistrict} />
						<Checkbox labelText="บัญชีรายชื่อ" class="!m-0" bind:checked={isByPartylist} />
					</div>
				</FormGroup>
			{/if}
			<div class="overflow-y-auto">
				{#if isDataHasSubgroup}
					<Accordion class="accordion-content-full">
						{#each filteredGroup as group (group.name)}
							{#if 'subgroups' in group}
								<AccordionItem open={currentPath === GroupByOption.Party}>
									<span slot="title" class="font-semibold"
										>{group.name}
										{#if currentPath !== GroupByOption.Party && currentPath !== GroupByOption.Province}
											<span class="font-normal text-gray-60"
												>({group.subgroups
													.map((e) => e.members.length)
													.reduce((a, c) => a + c)})</span
											>
										{/if}
									</span>
									<ul class="flex flex-col">
										{#each group.subgroups as { name, members, icon } (name)}
											<li class="border-b-solid border-b border-b-gray-30 last:border-none">
												<a
													href="#{getSubgroupHeadingId(group, name)}"
													class="body-01 flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-ui-03"
													class:font-semibold={currentCategory ===
														getSubgroupHeadingId(group, name)}
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
															class="aspect-square rounded-full border border-solid border-gray-30 bg-white object-cover"
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
								</AccordionItem>
							{/if}
						{/each}
					</Accordion>
				{:else}
					<ul class="flex flex-col">
						{#each filteredGroup as group (group.name)}
							{#if !('subgroups' in group)}
								<li
									class="border-b-solid first:border-t-solid border-b border-b-gray-30 first:border-t first:border-t-gray-30"
								>
									<a
										href="#{getSubgroupHeadingId(group)}"
										class="body-01 flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-ui-03"
										class:font-semibold={currentCategory === getSubgroupHeadingId(group)}
										on:click={() => {
											isMobile && (showFilter = false);
										}}
									>
										{#if group.icon}
											<img
												src={group.icon}
												alt=""
												width="16"
												height="16"
												class="aspect-square rounded-full border border-solid border-gray-30 bg-white object-cover"
											/>
										{/if}
										<span class="mr-auto">
											{group.name}
										</span>
										<span class="text-gray-60">{group.members.length}</span>
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				{/if}
			</div>
		</aside>
	{/if}
	<section bind:this={memberListSectionRef} class="flex flex-1 flex-col gap-4 p-4 text-gray-100">
		{#each filteredGroup as group (group.name)}
			{#if 'subgroups' in group}
				<div>
					<h2 class="fluid-heading-04 py-[6px] text-gray-60">{group.name}</h2>
					{#each group.subgroups as { name: subGroupName, members } (subGroupName)}
						<article class="member-subcategory">
							<h3
								id={getSubgroupHeadingId(group, subGroupName)}
								class="heading-compact-02 mb-2 flex items-baseline gap-2 border-b border-solid border-b-gray-30 p-4 font-semibold"
							>
								{subGroupName}
								<span class="body-01 text-gray-60"
									>{members.length} {currentPath === GroupByOption.Province ? 'เขต' : 'คน'}</span
								>
							</h3>
							<div
								class="grid gap-y-2"
								style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));"
							>
								{#each members as { candidateType, ...member }, idx (member.id + idx)}
									<div class="heading-compact-01">
										{#if isCabinet && member.assemblyRoleName}
											{roleAbbreviated(member.assemblyRoleName)}
										{/if}
										<PoliticianProfile {...member} />
									</div>
								{/each}
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="member-subcategory">
					<h2
						id={getSubgroupHeadingId(group)}
						class="heading-compact-02 mb-2 flex items-baseline gap-2 border-b border-solid border-b-gray-30 p-4 font-semibold"
					>
						{group.name}
						<span class="body-01 text-gray-60"
							>{group.members.length} {currentPath === GroupByOption.Province ? 'เขต' : 'คน'}</span
						>
					</h2>
					<article
						class="grid gap-y-2"
						style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));"
					>
						{#each group.members as member, idx (member.id + idx)}
							<div class="heading-compact-01">
								{#if isCabinet && member.assemblyRoleName}
									{roleAbbreviated(member.assemblyRoleName)}
								{/if}
								<PoliticianProfile {...member} />
							</div>
						{/each}
					</article>
				</div>
			{/if}
		{/each}
	</section>
</div>
<div class="sticky bottom-0 flex-none md:hidden">
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
		/>
	{/if}
</div>
<BackToTopButton padding={10} border={1} margin={12} showAt={80} />

<style>
	.member-subcategory > h2[id],
	.member-subcategory > h3[id] {
		scroll-margin-top: 128px;
	}
</style>
