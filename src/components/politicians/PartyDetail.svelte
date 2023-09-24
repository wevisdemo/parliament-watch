<script lang="ts">
	import type { PartyRole } from '$models/politician.ts';
	export let party: string;
	export let data: PartyRole[];

	// NOTE: assume ว่า data จะ sort มาแล้ว + มีข้อมูลอย่างน้อย 1
	let partyFrom = data.at(-1)?.from;
	let partyTo = data[0].to;
</script>

<li>
	<!-- TODO: add links -->
	<a class="text-black" href="/">{party}</a>
	<span class="text-gray-60"
		>({partyFrom
			? new Date(partyFrom).toLocaleDateString('th-TH', {
					month: 'short',
					year: '2-digit'
			  })
			: 'ปัจจุบัน'} - {partyTo
			? new Date(partyTo).toLocaleDateString('th-TH', {
					month: 'short',
					year: '2-digit'
			  })
			: 'ปัจจุบัน'})</span
	>
	<span class="block label-01">
		ตำแหน่ง:
		{#each data as role, idx (idx)}
			<span>
				{role.role}
				<span class="text-gray-60"
					>({new Date(role.from).toLocaleDateString('th-TH', {
						month: 'short',
						year: '2-digit'
					})} - {role.to
						? new Date(role.to).toLocaleDateString('th-TH', {
								month: 'short',
								year: '2-digit'
						  })
						: 'ปัจจุบัน'})</span
				>{idx !== data.length - 1 ? ',' : ''}
			</span>
		{/each}
	</span>
</li>
