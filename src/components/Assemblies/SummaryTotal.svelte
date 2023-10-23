<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page';
	import LowerHouseSummary from './LowerHouseSummary.svelte';
	import SeatChart from './SeatChart.svelte';
	import UpperHouseSummary from './UpperHouseSummary.svelte';
	import type { PartySeat } from './shared';

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

	const getSeatParties = (): PartySeat[] => {
		if (houseLevel === 'lower') {
			return getLowerHouseTotalPartie();
		}
		// TODO: implement upper house
		return [];
	};
</script>

<div class="flex md:flex-row flex-col">
	<div class="w-[50%]">
		<SeatChart parties={getSeatParties()} />
	</div>
	<div class="w-[50%]">
		{#if houseLevel === 'lower'}
			<LowerHouseSummary {data} />
		{:else}
			<UpperHouseSummary {data} />
		{/if}
	</div>
</div>

<style></style>
