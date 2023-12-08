<script lang="ts">
	import type { Politician } from '$models/politician';
	export let party: string;
	export let data: Politician['partyRoles'];

	// NOTE: assume ว่า data จะ sort มาแล้ว + มีข้อมูลอย่างน้อย 1
	let partyFrom = data.at(-1)?.startedAt;
	let partyTo = data[0].endedAt;
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
					>({new Date(role.startedAt).toLocaleDateString('th-TH', {
						month: 'short',
						year: '2-digit'
					})} - {role.endedAt
						? new Date(role.endedAt).toLocaleDateString('th-TH', {
								month: 'short',
								year: '2-digit'
						  })
						: 'ปัจจุบัน'})</span
				>{idx !== data.length - 1 ? ',' : ''}
			</span>
		{/each}
	</span>
</li>
