<script lang="ts">
	import { Search, Accordion, AccordionItem } from 'carbon-components-svelte';
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import { onMount } from 'svelte';

	export let data;
	$: ({ groups } = data);

	export let searchQuery = '';
	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<div class="flex">
	<aside class="flex-none flex flex-col w-[250px] sticky top-[80px] h-[calc(100dvh-80px)] px-6">
		<Search
			class="flex-1 mb-4 {!mounted ? '-mt-6' : ''}"
			placeholder="ค้นหาชื่อบุคคล"
			light
			bind:value={searchQuery}
			skeleton={!mounted}
		/>
		<div class="flex-[1_1_auto] h-0 overflow-y-auto">
			<Accordion size="xl" class="accordion-content-full">
				{#each groups as group (group.name)}
					<AccordionItem>
						<span slot="title" class="font-semibold">{group.name}</span>
						{#if 'subgroups' in group}
							<ul class="flex flex-col">
								{#each group.subgroups as { name, members, icon } (name)}
									<li
										class="flex items-center gap-2 body-01 text-gray-100 py-2 border-b border-b-solid border-b-gray-30"
									>
										{#if icon}
											<img
												src={icon}
												alt=""
												width="16"
												height="16"
												class="aspect-square object-cover border border-solid border-gray-30 rounded-full"
											/>
										{/if}
										<span class="mr-auto">
											{name}
										</span>
										<span class="text-gray-60">{members.length}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	</aside>
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
						{/each}
					</article>
				{/if}
			</section>
		{/each}
	</div>
</div>
