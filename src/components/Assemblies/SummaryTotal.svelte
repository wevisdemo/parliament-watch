<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';
	import CabinetChart from './CabinetChart.svelte';
	import LowerHouseSummary from './LowerHouseSummary.svelte';
	import SeatChart from './SeatChart.svelte';
	import UpperHouseSummary from './UpperHouseSummary.svelte';
	import { getSenateColorByTitle, type CabinetSeat, type PartySeat } from './shared';

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
				acc.push({
					name: party.name,
					count: party.count,
					color: party.color,
					members: party.members
				});
			}
			return acc;
		}, []);
		return result;
	};

	// const lowerHouseSeatLines = [58, 54, 51, 49, 46, 43, 40, 37, 35, 32, 29, 26];
	// const upperHouseSeatLines = [39, 36, 33, 30, 28, 25, 22, 20, 17];

	const LOWER_HOUSE_ROW_RATIO = [
		0.116, 0.108, 0.102, 0.098, 0.092, 0.086, 0.08, 0.074, 0.07, 0.064, 0.058
	];
	const UPPER_HOUSE_ROW_RATIO = [0.156, 0.144, 0.132, 0.12, 0.112, 0.1, 0.088, 0.08];
	const distributeLowerHouseSeatLines = (total: number, ratioTemplate: number[]) => {
		let remaining = total;
		let seatLine = [];
		for (const ratio of ratioTemplate) {
			const currentLine = Math.round(total * ratio);
			seatLine.push(currentLine);
			remaining -= currentLine;
		}
		seatLine.push(remaining);
		return seatLine;
	};

	$: getLowerHouseTotalPartie = (): PartySeat[] => {
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

	$: getUpperHouseTotalPartie = (): PartySeat[] => {
		return data.map((group) => {
			return {
				name: group.name,
				count: group.total,
				color: getSenateColorByTitle(group.name),
				members: group.senateMembers
			};
		});
	};

	$: seatParties =
		houseLevel === 'lower' || houseLevel === 'cabinet'
			? getLowerHouseTotalPartie()
			: getUpperHouseTotalPartie();

	$: lineAmounts = distributeLowerHouseSeatLines(
		seatParties.reduce((a, c) => a + c.count, 0),
		houseLevel === 'lower' || houseLevel === 'cabinet'
			? LOWER_HOUSE_ROW_RATIO
			: UPPER_HOUSE_ROW_RATIO
	);

	const getCabinetGroup = (cabinets: MemberGroup | undefined, groupName: CabinetSeat['role']) => {
		const res =
			cabinets?.parties
				?.map((party) => {
					const membersFilter =
						party.members?.filter(({ memberships }) => {
							const role = memberships.find(
								(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
							)?.posts[0].role;

							if (!role) return [];

							switch (groupName) {
								case 'นายกรัฐมนตรี':
								case 'รองนายกรัฐมนตรี':
									return role === groupName;
								case 'รัฐมนตรี':
									return (
										role.includes('รัฐมนตรีว่าการ') ||
										role.includes('รัฐมนตรีประจำสำนักนายกรัฐมนตรี')
									);
								default:
									return role.includes(groupName);
							}
						}) || [];

					return {
						...party,
						members: membersFilter,
						count: membersFilter.length
					};
				})
				.filter((party) => party.count > 0) || [];

		return res;
	};

	$: getSeatCarbinet = (): CabinetSeat[] => {
		const cabinets = data.find((group) => group.name === 'คณะรัฐมนตรี');
		const roles: CabinetSeat['role'][] = [
			'นายกรัฐมนตรี',
			'รองนายกรัฐมนตรี',
			'รัฐมนตรี',
			'รัฐมนตรีช่วย'
		];
		let cabinetSeat: CabinetSeat[] = [];
		roles.forEach((role) => {
			const cabinetGroup = getCabinetGroup(cabinets, role as CabinetSeat['role']);
			const cabinetParties = getTotalPartiesFromGroup({
				parties: cabinetGroup
			} as MemberGroup);
			cabinetSeat.push({
				role: role,
				parties: cabinetParties
			});
		});
		return cabinetSeat;
	};

	$: seatCarbinet = getSeatCarbinet();
</script>

<div class="flex flex-col space-y-[16px] md:flex-row">
	<div class="md:w-[50%]">
		{#if houseLevel === 'cabinet'}
			<CabinetChart cabinets={seatCarbinet} />
		{:else}
			<SeatChart parties={seatParties} {lineAmounts} />
		{/if}
	</div>
	<div class="md:w-[50%]">
		{#if houseLevel === 'lower' || houseLevel === 'cabinet'}
			<LowerHouseSummary {data} />
		{:else}
			<UpperHouseSummary {data} />
		{/if}
	</div>
</div>
