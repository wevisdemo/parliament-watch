<script lang="ts">
	import { formatThaiDate } from '$lib/date-parser';
	import type { PromiseClarificationLog } from '$models/promise';

	export let clarificationLogs: PromiseClarificationLog[] | undefined;
	// "clarificationLogs": [
	//   {
	//     "date": "2024-08-14T00:00:00.000Z",
	//     "title": "ทีมงาน WeVis ส่งจดหมายเปิดผนึกขอคำชี้แจงไปที่พรรคเพื่อไทย info@ptp.or.th"
	//   },
	//   {
	//     "date": "2024-08-18T00:00:00.000Z",
	//     "title": "ทีมงาน WeVis ส่งจดหมายติดตามคำชี้แจงไปที่พรรคเพื่อไทย info@ptp.or.th",
	//     "answer": {
	//       "date": "2024-08-20T00:00:00.000Z",
	//       "content": "Lorem ipsum dolor sit amet consectetur. Tincidunt enim vestibulum nullam auctor volutpat non eget adipiscing. Tortor netus volutpat quam nunc faucibus sed. Sit ornare quam ultricies quisque diam velit dignissim dui integer. Nisi curabitur in mauris id habitasse consequat nec in mi."
	//     }
	//   },
	//   {
	//     "date": "2024-08-21T00:00:00.000Z",
	//     "title": "ทีมงาน WeVis เห็นว่าคำสัญญานี้ยังคงคลุมเครือ แม้ว่าได้พิจารณาร่วมกับคำชี้แจ้งที่ได้รับแล้ว ในประเด็นต่อไปนี้ xxx yyy zzz จึงได้ดำเนินการขอคำชี้แจงเพิ่มเติม",
	//     "answer": {
	//       "date": "2024-08-22T00:00:00.000Z",
	//       "content": "Lorem ipsum dolor sit amet consectetur. Tincidunt enim vestibulum nullam auctor volutpat non eget adipiscing. Tortor netus volutpat quam nunc faucibus sed. Sit ornare quam ultricies quisque diam velit dignissim dui integer. Nisi curabitur in mauris id habitasse consequat nec in mi."
	//     }
	//   }
	// ],
</script>

{#if !clarificationLogs || clarificationLogs.length === 0}
	<div></div>
{:else}
	<div class="border-2 border-ui-01 p-4">
		<ul class="body-01 flex list-outside list-disc flex-col gap-1 px-4 text-text-02">
			{#each clarificationLogs as clarificationLog}
				<li>
					<div>
						<span>{formatThaiDate(clarificationLog.date, true)}</span>
						<span class="text-text-01">{clarificationLog.title}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style lang="postcss">
	li::marker {
		@apply text-xs;
	}
</style>
