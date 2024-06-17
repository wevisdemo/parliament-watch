<script lang="ts">
	export let proposerComparisonTableData: { [key: string]: string }[];
</script>

{#if proposerComparisonTableData.length > 0}
	<div class="w-full overflow-x-scroll">
		<table class="text-sm">
			<thead class="bg-gray-20">
				<tr class="h-12 border-b-2">
					{#each Object.keys(proposerComparisonTableData[0]) as columnHeading}
						<th class="text-01 p-4 px-4 font-semibold">{columnHeading}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="bg-gray-10">
				{#each Object.values(proposerComparisonTableData) as row}
					<tr class="h-12">
						{#each Object.values(row) as cell}
							<td class="p-4 align-middle">{cell}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style lang="postcss">
	td:first-child {
		@apply font-bold;
	}
	tbody {
		tr:not(:last-child) {
			@apply border-b border-solid border-gray-20;
		}
	}
</style>
