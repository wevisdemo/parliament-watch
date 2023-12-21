<script lang="ts">
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	export let currentNavElementIndex: number;
	export let assemblyRolesLength: number;
	export let partyCount: number;
	// export let agreedVoting: number;
	// export let disagreedVoting: number;
	// export let absentTotal: number;
</script>

<nav
	class="w-full bg-ui-05 rounded-sm overflow-hidden md:sticky md:top-8 md:w-[224px] md:flex-[0_0_224px]"
>
	<menu class="flex flex-col gap-[1px] list-none">
		<li
			class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[111ms] ease-productive-in-out"
			data-active={currentNavElementIndex === 0 || null}
		>
			<a href="#personal" class="block p-4 text-white no-underline">
				<div class="flex justify-between">
					<span>ข้อมูลพื้นฐาน</span>
					<ArrowDown class="md:hidden" />
					<ArrowRight class="hidden md:group-data-[active]:block" />
				</div>
			</a>
		</li>
		<li
			class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[113ms] ease-productive-in-out"
			data-active={currentNavElementIndex === 1 || null}
		>
			<a href="#politics" class="block p-4 text-white no-underline">
				<div class="flex justify-between">
					<span>ประวัติทางการเมือง</span>
					<ArrowDown class="md:hidden" />
					<ArrowRight class="hidden md:group-data-[active]:block" />
				</div>
				{#if assemblyRolesLength + partyCount > 0}
					<ul class="label-01 text-white/60">
						{#if assemblyRolesLength > 0}
							<li>{assemblyRolesLength} ตำแหน่ง</li>
						{/if}
						{#if partyCount > 0}
							<li>{partyCount} พรรคการเมือง</li>
						{/if}
					</ul>
				{/if}
			</a>
		</li>
		<!-- <li
			class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[114ms] ease-productive-in-out"
			data-active={currentNavElementIndex === 2 || null}
		>
			<a href="#votes" class="block p-4 text-white no-underline">
				<div class="flex justify-between">
					<span>ประวัติการลงมติ</span>
					<ArrowDown class="md:hidden" />
					<ArrowRight class="hidden md:group-data-[active]:block" />
				</div>
				<ul class="label-01 text-white/60">
					<li>เห็นด้วย {agreedVoting} มติ</li>
					<li>ไม่เห็นด้วย {disagreedVoting} มติ</li>
					<li>ลา/ขาดลงมติ {absentTotal} มติ</li>
				</ul>
			</a>
		</li> -->
		<!-- <li
				class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[112ms] ease-productive-in-out"
				data-active={currentNavElementIndex === 3 || null}
			>
				<a href="#bill" class="block p-4 text-white no-underline">
					<div class="flex justify-between">
						<span>ประวัติการเสนอกฏหมาย</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
					<ul class="label-01 text-white/60">
						<li>{totalProposedBill} ร่าง</li>
					</ul>
				</a>
			</li> -->
	</menu>
</nav>
