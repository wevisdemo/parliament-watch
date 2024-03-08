<script lang="ts">
	import type { AssemblySummary } from '../../../routes/assemblies/[id]/votes/+page.server';
	import AssemblyIdRunner from '$components/Assemblies/AssemblyIdRunner.svelte';

	export let assembly: AssemblySummary;
	export let assemblyIds: string[] = [];
</script>

<div
	class="flex w-full flex-col justify-between bg-field-01 px-[16px] py-[16px] md:flex-row md:px-[64px] md:py-[48px]"
>
	<div class="flex w-full max-w-[900px] items-center">
		<div class="flex flex-col md:flex-row">
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
