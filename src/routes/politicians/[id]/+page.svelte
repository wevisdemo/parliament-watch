<script lang="ts">
	import PositionStatus from '$components/politicians/PositionStatus.svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import Share from '$components/politicians/Share.svelte';

	export let data;

	const { politician } = data;
</script>

<header class="font-sans px-4 py-8 md:px-16 md:py-12">
	<div class="relative w-[120px] h-[120px] mb-4">
		<img
			class="rounded-full overflow-hidden w-full h-full object-cover"
			src={politician.avatar}
			alt={politician.firstname + ' ' + politician.lastname}
			width="120"
			height="120"
			loading="lazy"
			decoding="async"
		/>
		<!-- FIXME: Get current party to avoid partyRoles being empty arr -->
		<img
			class="absolute right-0 bottom-0 rounded-full overflow-hidden w-[32px] h-auto aspect-square bg-white border border-gray-30 border-solid object-contain"
			src={politician.partyRoles[0].party.logo}
			alt={politician.partyRoles[0].party.name}
			width="32"
			height="32"
			loading="lazy"
			decoding="async"
		/>
	</div>
	<div class="flex flex-col gap-8 md:flex-row md:gap-16">
		<div class="flex-1 flex flex-col gap-2">
			<!-- FIXME: ไม่มีคำนำหน้า -->
			<h1 class="fluid-heading-05">{politician.firstname} {politician.lastname}</h1>
			<PositionStatus isActive={politician.isActive} />
			{#if politician.assemblyRoles.length > 0}
				<h2 class="heading-01 -mb-2">ตำแหน่งปัจจุบัน</h2>
				<ul class="body-01 list-disc ml-8">
					{#each politician.assemblyRoles as role}
						<!-- TODO: add link -->
						<li>
							{role.role} ใน
							<a class="text-black" href="/">{role.assembly.name} ชุดที่ {role.assembly.term}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-2 border border-solid border-gray-20 rounded-sm p-3">
				<div class="flex items-center gap-1">
					<Download />
					<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
				</div>
				<!-- TODO: add link -->
				<a href="/" class="flex items-center gap-1 mr-auto helper-text-01">
					<TableSplit />
					<span>ผลการลงมติรายคน</span>
				</a>
			</div>
			<p class="label-01 text-gray-60">อัปเดตข้อมูล: 18 ส.ค. 2566</p>
			<!-- TODO: add link -->
			<a href="/" class="mr-auto helper-text-01"> ที่มาและข้อจำกัดข้อมูล </a>
			<Share />
		</div>
	</div>
</header>

<details>
	<summary>Data</summary>
	<pre>
		{JSON.stringify(politician, null, 2)}
	</pre>
</details>
