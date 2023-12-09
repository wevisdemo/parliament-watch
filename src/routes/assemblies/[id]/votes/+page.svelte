<script lang="ts">
	import VotesMain from '$components/Assemblies/Votes/VotesMain.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';
	import type { FilterOptions } from './+page.js';

	export let data;

	const { assemblyIds, assembly, votes } = data;

	let categoryFilters = votes.reduce((acc, vote) => {
		const categorys = vote.categories;
		categorys.forEach((category) => {
			if (!acc.includes(category)) {
				acc.push(category);
			}
		});
		return acc;
	}, [] as string[]);

	let filterOptions: FilterOptions = {
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
					<OverflowMenuItem href="/" text="รัฐสภา" />
					<OverflowMenuItem href="/assemblies/{assembly.id}" text={assembly.name} />
				</OverflowMenu>
			</BreadcrumbItem>

			<BreadcrumbItem class="hidden md:block" href="/">รัฐสภา</BreadcrumbItem>
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
