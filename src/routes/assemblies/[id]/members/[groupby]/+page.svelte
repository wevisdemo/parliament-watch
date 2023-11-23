<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	export let data;
	$: ({ groups } = data);
</script>

<div class="p-4 text-gray-100 flex flex-col gap-4">
	{#each groups as group (group.name)}
		<section>
			<h2 class="py-[6px] text-gray-60 fluid-heading-04">{group.name}</h2>
			{#if 'subgroups' in group}
				<article>
					{#each group.subgroups as { name: sgroup_name, members } (sgroup_name)}
						<h3
							class="flex items-baseline gap-2 p-4 mb-2 border-b border-solid border-b-gray-30 heading-compact-02 font-semibold"
						>
							{sgroup_name}
							<span class="body-01 text-gray-60">{members.length} คน</span>
						</h3>
						<div class="flex gap-y-2 flex-wrap">
							{#each members as { id, avatar, firstname, lastname, role, isActive, party } (id)}
								<PoliticianProfile {id} {avatar} {firstname} {lastname} {role} {isActive} {party} />
							{/each}
						</div>
					{/each}
				</article>
			{/if}
		</section>
	{/each}
</div>
