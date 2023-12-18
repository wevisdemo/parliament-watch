<script lang="ts">
	import type { Party } from '$models/party';
	import { Information } from 'carbon-icons-svelte';
	import Badge from './Badge.svelte';
	import HalfDonutWrapper from './HalfDonutWrapper.svelte';
	import {
		getPercentWidth,
		getRoundedPercent,
		getSumOfGroupsTotal,
		getTopOfGroups,
		getTopOfGroupsPercent,
		type PartySelected
	} from './shared';
	import { onMount } from 'svelte';
	export let title = '';
	export let data: {
		memberGroups: MemberGroup[];
		assemblyId: string;
	};
	$: ({ memberGroups, assemblyId } = data);
	interface MemberGroup {
		name: string;
		total: number;
		parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
	}
	let url = '';
	onMount(() => (url = window.location.href));

	enum GroupByOption {
		Party = 'party',
		Province = 'province',
		AppointmentMethod = 'appointment-method',
		Sex = 'sex',
		Age = 'age',
		Education = 'education'
		// TODO: Asset is not in phase 1
		// Assets = 'assets'
	}

	const groupByMapToEnum = new Map<string, GroupByOption>([
		['พรรค', GroupByOption.Party],
		['จังหวัด', GroupByOption.Province],
		['ที่มา', GroupByOption.AppointmentMethod],
		['เพศสภาพ', GroupByOption.Sex],
		['รุ่นอายุ', GroupByOption.Age],
		['การศึกษา', GroupByOption.Education]
	]);

	$: getRenderPartyList = (parties: MemberGroup['parties'] = []): PartySelected[] => {
		// sort parties by count DESC
		const sortedParties = parties.sort((a, b) => b.count - a.count);
		// get top 5 parties
		const top5Parties = sortedParties.slice(0, 5);
		// map top5Parties to PartySelected
		const result = top5Parties.map((party) => ({
			label: party.name,
			count: party.count,
			color: party.color
		}));
		// if parties has more than 5 parties, add "อื่นๆ" to result
		if (parties.length > 5) {
			const otherCount = parties.slice(5).reduce((acc, party) => acc + party.count, 0);
			result.push({
				label: 'อื่นๆ',
				count: otherCount,
				color: '#8D8D8D'
			});
		}
		return result;
	};

	$: getGroupLink = (key: string, value: string) => {
		return `/assemblies/${data.assemblyId}/members/${groupByMapToEnum.get(key)}?category=${value}`;
	};
</script>

<div class="bg-ui-01 p-[16px] m-auto min-w-[226px] w-full flex flex-col h-full">
	<p class="fluid-heading-03">{title}</p>
	<HalfDonutWrapper
		chartId="summary-{title}"
		percent={getTopOfGroupsPercent(memberGroups)}
		label={getTopOfGroups(memberGroups).name}
	/>
	<div class="grid gap-[8px]">
		{#each memberGroups as group}
			<div>
				<div class="flex">
					<p class="heading-01">{group.name}</p>
					{#if group.name !== 'ไม่มีข้อมูล'}
						<a class="ml-[4px]" href={getGroupLink(title, group.name)}>
							<Information class="text-gray-70" />
						</a>
					{/if}
					<p class="body-compact-01 ml-[4px] text-gray-70">
						{getRoundedPercent(group.total, getSumOfGroupsTotal(memberGroups))}%
					</p>
				</div>
				<div
					class="flex w-[var(--width)] space-x-[2px]"
					style="--width: {getPercentWidth(group.total, memberGroups)}%;"
				>
					{#each getRenderPartyList(group.parties || []) as party}
						<Badge color={party.color} title={party.label} subtitle={`${party.count} คน`} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
