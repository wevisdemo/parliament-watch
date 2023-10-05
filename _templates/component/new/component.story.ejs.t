---
to: src/components/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.story.svelte
---

<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import <%= h.changeCase.pascal(name) %> from './<%= h.changeCase.pascal(name) %>.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="<%= h.changeCase.pascal(name) %>">
	<<%= h.changeCase.pascal(name) %> />
</Hst.Story>
