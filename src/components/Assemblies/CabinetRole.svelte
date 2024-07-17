<script lang="ts">
	import type { CabinetSeat } from './shared';

	export let cabinets: CabinetSeat[];
	export let role: CabinetSeat['role'];
</script>

<div class="role">
	<p class="heading-compact-01">{role}</p>
	<div class="group-dot">
		{#each cabinets.find((c) => role === c.role)?.parties || [] as party}
			{#each Array.from({ length: party.count || 0 }, (_, i) => i) as _}
				<span class="dot" style="background-color: {party.color || '#8D8D8D'};"></span>
			{/each}
		{/each}
	</div>
</div>

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
