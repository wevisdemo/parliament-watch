<script lang="ts">
	import { Modal } from 'carbon-components-svelte';
	import PromiseStatusTag from './PromiseStatusTag.svelte';
	import { promiseStatusList } from '../../constants/promise';

	export let open = false;
	export let onClose: () => void;
</script>

<Modal {open} passiveModal hasScrollingContent size="xs" on:close={onClose}>
	<div slot="heading">
		<div class="heading-03">สถานะคำสัญญา</div>
	</div>
	<div class="mt-4 flex flex-col gap-4">
		{#each promiseStatusList as status}
			<div>
				<PromiseStatusTag isLarge status={status.label} />
				<div class="body-02 mt-2">{status.text}</div>
			</div>
		{/each}
	</div>
</Modal>
