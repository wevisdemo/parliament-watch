<script lang="ts">
	import { Accordion, AccordionItem } from 'carbon-components-svelte';

	export let data;
</script>

<div class="p-4 space-y-6">
	<h1 class="fluid-display-01 text-blue-60">Parliament Watch 👀</h1>

	<ul>
		<li>
			<a href="/politicians/สมชาติ-สกุลสมมุติ"
				>[WEV-12] Users can learn about a politician's details</a
			>
		</li>
		<li>
			[WEV-14] Users can learn more about an assembly
			<ul>
				<li><a href="/assemblies/สมาชิกสภาผู้แทนราษฎร-25">สส.</a></li>
				<li><a href="/assemblies/วุฒิสภา-12">สว.</a></li>
			</ul>
		</li>
		<li>
			<a href="/legislative-process">[WEV-18] Users can learn the legislative process</a>
		</li>
		<li>
			<a href="/votings/1">[WEV-10] Users can view voting details</a>
			<ul>
				<li>
					<a href="/votings/1/votes">votes data table page</a>
				</li>
			</ul>
		</li>
		<li>
			<a href="/bills/1">[WEV-15] Users can view details and track progress of a bill</a>
		</li>
		<li>
			<a href="/bills">[WEV-16] Users can browse for a bill</a>
			<ul>
				<li>
					<a href="/bills/search">bills data table page</a>
				</li>
			</ul>
		</li>
	</ul>
</div>

<div class="p-4">
	<Accordion>
		<AccordionItem title="Data"><p>{JSON.stringify(data, null, 2)}</p></AccordionItem>
	</Accordion>
</div>

<style lang="postcss">
	ul {
		@apply list-disc list-inside;
	}

	li > ul {
		@apply ml-4;
	}

	a {
		@apply underline;
	}
</style>
