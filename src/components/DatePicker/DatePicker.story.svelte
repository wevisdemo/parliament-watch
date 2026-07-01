<script lang="ts">
	import DatePicker from './DatePicker.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;

	let selectedDate = new Date();
	const handleSelectDate = (date: Date) => {
		selectedDate = date;
	};
</script>

<Hst.Story title="DatePicker" layout={{ type: 'single' }}>
	<DatePicker {selectedDate} {handleSelectDate} />
</Hst.Story>
