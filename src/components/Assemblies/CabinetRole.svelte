<script lang="ts">
	import type { AssemblyMember } from '$lib/politigraph/assembly/member';
	import AssemblyTooltip from './AssemblyTooltip.svelte';
	import type { CabinetSeat, TooltipProp } from './shared';

	interface Props {
		cabinets: CabinetSeat[];
		role: CabinetSeat['role'];
	}

	let { cabinets, role }: Props = $props();

	let tooltipProp: TooltipProp | null = $state(null);

	const showTooltip = (event: MouseEvent, member: AssemblyMember) => {
		tooltipProp = {
			title: member.name,
			additional: member.memberships[0].label ?? '',
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
		{#each cabinets.find((c) => role === c.role)?.parties || [] as party (party.name)}
			{#each party?.members ?? [] as member (member.id)}
				<div
					role="tooltip"
					class="dot"
					style="background-color: {party.color || '#8D8D8D'};"
					onmouseenter={(e) => showTooltip(e, member)}
					onmouseleave={hideTooltip}
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
