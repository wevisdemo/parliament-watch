<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import VoteCard from './VoteCard.svelte';
	import { failedVoting } from '../../mocks/data/voting';
	export let Hst: Hst;
</script>

<Hst.Story title="VoteCard">
	<VoteCard voting={failedVoting} />
</Hst.Story>
