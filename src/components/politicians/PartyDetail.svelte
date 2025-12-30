<script lang="ts">
	import { formatDateRange } from '$lib/date-parser';
	import type { Membership, Post } from '$lib/politigraph/genql';
	export let party: string;

	export let memberships: (Pick<Membership, 'start_date' | 'end_date'> & {
		posts: Pick<Post, 'role'>[];
	})[];

	// NOTE: assume ว่า data จะ sort มาแล้ว + มีข้อมูลอย่างน้อย 1
	$: partyFrom = memberships.at(-1)?.start_date;
	$: partyTo = memberships.at(0)?.end_date;
</script>

<li>
	<!-- TODO: add links -->
	<span class="text-black">{party}</span>
	<span class="text-gray-60">
		({formatDateRange(partyFrom, partyTo, { shortMonth: true, hideDay: true, shortYear: true })})
	</span>
	<span class="label-01 block">
		ตำแหน่ง :
		{#each memberships as { posts: [post], start_date, end_date }, idx (idx)}
			<span>
				{post.role}
				<span class="text-gray-60">
					({formatDateRange(start_date, end_date, {
						shortMonth: true,
						hideDay: true,
						shortYear: true
					})})
				</span>{idx !== memberships.length - 1 ? ',' : ''}
			</span>
		{/each}
	</span>
</li>
