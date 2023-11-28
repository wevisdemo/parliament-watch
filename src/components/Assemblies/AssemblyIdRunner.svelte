<script lang="ts">
	export let currentId = '';
	export let startedYear: number;
	export let term: number;
	export let assemblyIds: string[] = [];
	export let postfix = '';

	const redirectNextAssembly = () => {
		const current = assemblyIds.findIndex((id) => id === currentId);
		if (current === assemblyIds.length - 1) return;
		const next = assemblyIds[current + 1];
		if (next) {
			window.location.href = `/assemblies/${next}${postfix ? `/${postfix}` : ''}`;
		}
	};

	const redirectPrevAssembly = () => {
		const current = assemblyIds.findIndex((id) => id === currentId);
		if (current === 0) return;
		const prev = assemblyIds[current - 1];
		if (prev) {
			window.location.href = `/assemblies/${prev}${postfix ? `/${postfix}` : ''}`;
		}
	};

	const checkIfLastAssembly = () => {
		const current = assemblyIds.findIndex((id) => id === currentId);
		return current === assemblyIds.length - 1;
	};

	const checkIfFirstAssembly = () => {
		const current = assemblyIds.findIndex((id) => id === currentId);
		console.log(current, assemblyIds);
		return current === 0;
	};
</script>

<div class="flex items-center md:ml-[16px] ml-[0px]">
	<button disabled={checkIfFirstAssembly()} on:click={() => redirectPrevAssembly()}>
		<img
			src="/icons/angle-right.svg"
			alt="angle-left"
			class="rotate-180 w-[20px] mr-[16px] ml-[0px] fill-gray-300"
		/>
	</button>
	<h3 class="fluid-heading-03">ชุดที่ {term} | {startedYear}</h3>
	<button disabled={checkIfLastAssembly()} on:click={() => redirectNextAssembly()}>
		<img src="/icons/angle-right.svg" alt="angle-right" class="w-[20px] ml-[16px] mr-[0px]" />
	</button>
</div>

<style></style>
