<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PoliticianPicture from './PoliticianPicture.svelte';
	export let Hst: Hst;

	let avatar = 'https://placehold.co/128x128?text=politician';
	let party = {
		name: 'ก้าวไกล',
		logo: 'https://placehold.co/64x64/FF5C00/white?text=party',
		color: '#ff7f00'
	};
	let className = '';
	let avatarClass = '';
	let size = 40;
	let partySize = 16;
	let partyClass = '';
</script>

<Hst.Story title="PoliticianPicture" layout={{ type: 'grid', width: 320 }}>
	<Hst.Variant title="Default">
		<PoliticianPicture
			class={className}
			{avatar}
			{size}
			{avatarClass}
			{party}
			{partySize}
			{partyClass}
		/>
	</Hst.Variant>

	<Hst.Variant title="Party is not given">
		<PoliticianPicture class={className} {avatar} {size} {avatarClass} {partySize} {partyClass} />
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Text bind:value={className} title="class" />
		<hr />
		<Hst.Text bind:value={avatar} title="avatar" />
		<Hst.Number bind:value={size} title="size" />
		<Hst.Text bind:value={avatarClass} title="avatarClass" />
		<hr />
		<Hst.Json bind:value={party} title="party" />
		<Hst.Number bind:value={partySize} title="partySize" />
		<Hst.Text bind:value={partyClass} title="avatarClass" />
	</svelte:fragment>
</Hst.Story>
