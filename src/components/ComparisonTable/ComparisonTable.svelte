<script lang="ts">
	export let proposerComparisonTableData: { [key: string]: string }[];
</script>

{#if proposerComparisonTableData.length > 0}
	<table class="w-full text-sm">
		<thead class="bg-gray-20">
			<tr class="w-full h-12 border-b-2">
				{#each Object.keys(proposerComparisonTableData[0]) as columnHeading}
					<th class="text-01 font-semibold px-4 p-4">{columnHeading}</th>
				{/each}
			</tr>
		</thead>
		<tbody class="w-full bg-gray-10">
			{#each Object.values(proposerComparisonTableData) as row}
				<tr class="w-full h-12">
					{#each Object.values(row) as cell}
						<td class="p-4 align-middle">{cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style lang="ts">
	td:first-child {
		@apply font-bold;
	}
	tbody {
		tr:not(:last-child) {
			@apply border-b border-gray-20 border-solid;
		}
	}
</style>
