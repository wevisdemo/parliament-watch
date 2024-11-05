<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import DatePicker from './DatePicker.svelte';
	export let Hst: Hst;

	let selectedDate = new Date();
	const handleSelectDate = (date: Date) => {
		selectedDate = date;
	};
</script>

<Hst.Story title="DatePicker" layout={{ type: 'single' }}>
	<DatePicker {selectedDate} {handleSelectDate} />
</Hst.Story>
