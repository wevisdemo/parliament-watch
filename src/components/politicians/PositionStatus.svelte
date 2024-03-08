<script lang="ts">
	import { Tag } from 'carbon-components-svelte';

	export let isActive = false;
</script>

<Tag class="label-01 my-0 mr-auto" type={isActive ? 'cyan' : 'warm-gray'}>
	{isActive ? 'อยู่ในตำแหน่งทางการเมือง' : 'ไม่อยู่ในตำแหน่งทางการเมือง'}
</Tag>
