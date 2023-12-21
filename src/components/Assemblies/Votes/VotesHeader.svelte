<script lang="ts">
	import type { AssemblySummary } from '../../../routes/assemblies/[id]/votes/+page';
	import AssemblyIdRunner from '$components/Assemblies/AssemblyIdRunner.svelte';

	export let assembly: AssemblySummary;
	export let assemblyIds: string[] = [];
</script>

<div
	class="flex md:flex-row flex-col w-full justify-between md:py-[48px] py-[16px] md:px-[64px] px-[16px] bg-field-01"
>
	<div class="w-full max-w-[900px] flex items-center">
		<div class="flex md:flex-row flex-col">
			<h2 class="fluid-heading-04">{assembly.name}</h2>
			<AssemblyIdRunner
				currentId={assembly.id}
				startedYear={assembly.startedAt}
				term={assembly.term}
				{assemblyIds}
				postfix="votes"
			/>
		</div>
	</div>
</div>
