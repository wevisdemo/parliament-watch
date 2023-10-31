<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page';
	import LowerHouseSummary from './LowerHouseSummary.svelte';
	import SeatChart from './SeatChart.svelte';
	import UpperHouseSummary from './UpperHouseSummary.svelte';
	import { getSenateColorByTitle, type PartySeat } from './shared';

	export let data: MemberGroup[] = [];
	export let houseLevel = 'upper';
	const getTotalPartiesFromGroup = (group: MemberGroup | undefined): PartySeat[] => {
		if (!group) return [];
		const parties = group.parties || [];
		const result = parties.reduce<PartySeat[]>((acc, party) => {
			const foundParty = acc.find((p) => p.name === party.name);
			if (foundParty) {
				foundParty.count += party.count;
			} else {
				acc.push({ name: party.name, count: party.count, color: party.color });
			}
			return acc;
		}, []);
		return result;
	};

	const lowerHouseSeatLines = [58, 54, 51, 49, 46, 43, 40, 37, 35, 32, 29, 26];
	const upperHouseSeatLines = [39, 36, 33, 30, 28, 25, 22, 20, 17];

	const getLowerHouseTotalPartie = (): PartySeat[] => {
		const governmentGroup = data.find((group) => group.name === 'ฝ่ายรัฐบาล');
		const oppositeGovGroup = data.find((group) => group.name === 'ฝ่ายค้าน');
		const governmentParties = getTotalPartiesFromGroup(governmentGroup);
		const oppositeGovParties = getTotalPartiesFromGroup(oppositeGovGroup);
		// sort governmentParties by count DESC
		governmentParties.sort((a, b) => b.count - a.count);
		// sort oppositeGovParties by count ASC
		oppositeGovParties.sort((a, b) => a.count - b.count);
		return [...governmentParties, ...oppositeGovParties];
	};

	const getUpperHouseTotalPartie = (): PartySeat[] => {
		return data.map((group) => {
			return {
				name: group.name,
				count: group.total,
				color: getSenateColorByTitle(group.name)
			};
		});
	};

	const getSeatParties = (): PartySeat[] => {
		if (houseLevel === 'lower') {
			return getLowerHouseTotalPartie();
		}
		return getUpperHouseTotalPartie();
	};

	const getLineAmounts = (): number[] => {
		if (houseLevel === 'lower') {
			return lowerHouseSeatLines;
		}
		return upperHouseSeatLines;
	};
</script>

<div class="flex md:flex-row flex-col space-y-[16px]">
	<div class="md:w-[50%]">
		<SeatChart parties={getSeatParties()} lineAmounts={getLineAmounts()} />
	</div>
	<div class="md:w-[50%]">
		{#if houseLevel === 'lower'}
			<LowerHouseSummary {data} />
		{:else}
			<UpperHouseSummary {data} />
		{/if}
	</div>
</div>
