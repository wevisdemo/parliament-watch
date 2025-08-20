<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PoliticianProfile from './PoliticianProfile.svelte';
	export let Hst: Hst;

	let id = 'ปิยบุตร-แสงกนกกุล';
	let name = 'ปิยบุตร แสงกนกกุล';
	let avatar = 'https://via.placeholder.com/64';
	let party = {
		name: 'ก้าวไกล',
		logo: 'https://www.moveforwardparty.org/wp-content/uploads/2021/03/400px-Move_Forward_Party_Logo.svg.png',
		color: '#ff7f00'
	};
	let role = 'สส.บัญชีรายชื่อ';
</script>

<Hst.Story title="PoliticianProfile" layout={{ type: 'grid', width: 320 }}>
	<Hst.Variant title="Default">
		<PoliticianProfile {id} {name} {avatar} partyName={party.name} partyLogo={party.logo} {role} />
	</Hst.Variant>

	<Hst.Variant title="Party is not given">
		<PoliticianProfile {id} {name} {avatar} {role} />
	</Hst.Variant>

	<Hst.Variant title="isLarge = true">
		<PoliticianProfile
			{id}
			{name}
			{avatar}
			partyName={party.name}
			partyLogo={party.logo}
			{role}
			isLarge
		/>
	</Hst.Variant>

	<Hst.Variant title="isActive = false">
		<PoliticianProfile
			{id}
			{name}
			{avatar}
			partyName={party.name}
			partyLogo={party.logo}
			{role}
			isActive={false}
		/>
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Text bind:value={id} title="id" />
		<Hst.Text bind:value={name} title="name" />
		<Hst.Text bind:value={avatar} title="avatar" />
		<Hst.Json bind:value={party} title="party" />
		<Hst.Text bind:value={role} title="role" />
	</svelte:fragment>
</Hst.Story>
