<script lang="ts">
	export let index: number;
	export let firstname: string;
	export let lastname: string;
	export let logo: string | undefined;
</script>

<tr>
	<td class="body-01 text-text-02 text-start pb-2" style="fixed; width: 1%">{index}</td>
	<td class="pb-2">
		<div class="ml-1.5 flex gap-1 items-center">
			<div
				class="flex items-center justify-center rounded-full border border-gray-30 overflow-hidden"
				style="width: 16px; height: 16px;"
			>
				<img src={logo ? logo : ''} alt="" />
			</div>
			<p class="underline text-start">{firstname + ' ' + lastname}</p>
		</div>
	</td>
</tr>
