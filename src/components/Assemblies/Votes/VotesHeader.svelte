<script lang="ts">
	import AssemblyIdRunner, {
		type AvailableAssembly
	} from '$components/Assemblies/AssemblyIdRunner.svelte';

	export let name: string;
	export let term: number;
	export let startedYear: Date;
	export let availableAssemblies: AvailableAssembly[];
</script>

<div
	class="flex w-full flex-col justify-between bg-field-01 px-[16px] py-[16px] md:flex-row md:px-[64px] md:py-[48px]"
>
	<div class="flex w-full max-w-[900px] items-center">
		<div class="flex flex-col md:flex-row">
			<h2 class="fluid-heading-04">{name}</h2>
			<AssemblyIdRunner {term} {startedYear} {availableAssemblies} linkPostfix="votes" />
		</div>
	</div>
</div>
