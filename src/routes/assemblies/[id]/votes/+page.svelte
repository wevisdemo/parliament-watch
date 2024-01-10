<script lang="ts">
	import VotesMain from '$components/Assemblies/Votes/VotesMain.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';

	export let data;

	$: ({ assemblyIds, assembly, votes } = data);

	$: categoryFilters = votes.reduce((acc, vote) => {
		const categories = vote.categories;
		categories.forEach((category) => {
			if (!acc.includes(category)) {
				acc.push(category);
			}
		});
		return acc;
	}, [] as string[]);

	$: filterOptions = {
		categories: categoryFilters,
		result: ['ผ่าน', 'ไม่ผ่าน']
	};
</script>

<div>
	<div class="px-[16px] py-[8px]">
		<Breadcrumb noTrailingSlash class="[&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap">
			<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
			<!-- TODO: link this -->
			<BreadcrumbItem class="md:hidden">
				<OverflowMenu>
					<OverflowMenuItem text="รัฐสภา" />
					<OverflowMenuItem href="/assemblies/{assembly.id}" text={assembly.name} />
				</OverflowMenu>
			</BreadcrumbItem>

			<BreadcrumbItem class="hidden md:block">รัฐสภา</BreadcrumbItem>
			<BreadcrumbItem class="hidden md:block" href="/assemblies/{assembly.id}"
				>{assembly.name}</BreadcrumbItem
			>
			<BreadcrumbItem href="/assemblies/{assembly.id}/votes" isCurrentPage
				>ประวัติการลงมติ</BreadcrumbItem
			>
		</Breadcrumb>
	</div>
	<VotesMain {votes} {assembly} {assemblyIds} {filterOptions} />
</div>
