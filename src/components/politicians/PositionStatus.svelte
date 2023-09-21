<script lang="ts">
	import { Tag } from 'carbon-components-svelte';

	export let isActive = false;
</script>

<Tag class="mr-auto my-0 label-01" type={isActive ? 'cyan' : 'warm-gray'}>
	{isActive ? 'อยู่ในตำแหน่งทางการเมือง' : 'ไม่อยู่ในตำแหน่งทางการเมือง'}
</Tag>
