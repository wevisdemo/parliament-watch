<script lang="ts">
	import type { AssemblyMember } from '$lib/datasheets/assembly-member';
	import AssemblyTooltip from './AssemblyTooltip.svelte';
	import type { CabinetSeat, TooltipProp } from './shared';

	export let cabinets: CabinetSeat[];
	export let role: CabinetSeat['role'];

	let tooltipProp: TooltipProp | null = null;

	const showTooltip = (event: MouseEvent, member: AssemblyMember) => {
		const name = `${member.firstname} ${member.lastname}`;

		tooltipProp = {
			title: name,
			additional: member.assemblyRole.role,
			x: event.layerX,
			y: event.layerY + 20
		};
	};

	const hideTooltip = () => {
		tooltipProp = null;
	};
</script>

<div class="role">
	<p class="heading-compact-01">{role}</p>
	<div class="group-dot">
		{#each cabinets.find((c) => role === c.role)?.parties || [] as party}
			{#each party?.members ?? [] as member}
				<div
					role="tooltip"
					class="dot"
					style="background-color: {party.color || '#8D8D8D'};"
					on:mouseenter={(e) => showTooltip(e, member)}
					on:mouseleave={hideTooltip}
				></div>
			{/each}
		{/each}
	</div>
</div>

<AssemblyTooltip {tooltipProp}></AssemblyTooltip>

<style lang="scss">
	.group-dot {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 3px;
		max-width: 130px;
	}

	.dot {
		height: 16px;
		width: 16px;
		border-radius: 50%;
		display: inline-block;
	}

	.role {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
</style>
