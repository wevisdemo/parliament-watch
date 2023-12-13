<script lang="ts">
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';
	import Carousel from '$components/Index/Carousel.svelte';
	import StatCard from '$components/Index/StatCard.svelte';
	import SearchInput from '$components/SearchInput/SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import type { SearchResults } from '$models/search';
	import { Button, Search } from 'carbon-components-svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import { searchIndexes } from '../mocks/data/searchIndexes';

	export let data;
	$: ({ highlightedPoliticians, otherSourcesHighlightedPoliticians } = data);

	let searchResults: SearchResults | null;
</script>

<div class="md:h-[calc(100lvh-48px)] flex flex-col">
	<header
		class="h-[400px] md:h-auto md:flex-1 bg-gradient-to-t from-[#CCEEFF] to-[#FDFEFF] flex items-center justify-center flex-col gap-[10px] px-4 overflow-hidden relative"
	>
		<img
			class="absolute w-full max-w-[1280px] h-auto bottom-0 left-1/2 -translate-x-1/2"
			src="/images/sapasathan.svg"
			alt=""
			width="634"
			height="153"
			loading="eager"
			decoding="async"
		/>
		<h1 class="relative fluid-display-01 max-w-[1280px] text-center" style="text-wrap:balance">
			<span class="whitespace-nowrap">ขับเคลื่อน</span><span class="whitespace-nowrap"
				>ประชาธิปไตย</span
			> <br class="hidden md:block" /><span class="whitespace-nowrap">ร่วมเฝ้าดู</span><span
				class="whitespace-nowrap">ความเคลื่อนไหว</span
			><span class="whitespace-nowrap">รัฐสภา</span>
		</h1>
		<p class="relative flex gap-[10px] helper-text-01 text-gray-60">
			<span>อัปเดตข้อมูล: 18 ส.ค. 2566</span>
			<!-- TODO: Add link -->
			<a href="/" class="underline text-[color:inherit]">ที่มาและข้อจำกัดข้อมูล</a>
		</p>
	</header>
	<nav>
		<menu class="max-w-[1280px] mx-auto flex flex-col md:flex-row">
			<li class="flex-1">
				<a
					href="#politician"
					class="flex gap-3 items-start p-4 bg-white body-01 text-[color:inherit] md:gap-1 md:flex-col md:items-center md:text-center md:p-8 !no-underline"
				>
					<PoliticianIcon class="aspect-square w-6 h-auto md:w-8" />
					<span class="flex-1 flex flex-col gap-1">
						<span class="fluid-heading-03">นักการเมือง</span>
						<span>ส่องประวัติและผลงานของคนที่คุณสนใจ</span>
					</span>
					<ArrowDown />
				</a>
			</li>
			<li class="flex-1">
				<span
					class="flex gap-3 items-start p-4 bg-white body-01 text-[color:inherit] md:gap-1 md:flex-col md:items-center md:text-center md:p-8"
				>
					<VoteIcon class="aspect-square w-6 h-auto md:w-8 opacity-30" />
					<span class="flex-1 flex flex-col gap-1 opacity-30">
						<span class="fluid-heading-03">การลงมติ</span>
						<span>ดูผลการโหวต พร้อมคำอธิบายเข้าใจง่าย</span>
					</span>
					<span class="label-01 whitespace-nowrap">เร็วๆ นี้..</span>
				</span>
			</li>
			<li class="flex-1">
				<span
					class="flex gap-3 items-start p-4 bg-white body-01 text-[color:inherit] md:gap-1 md:flex-col md:items-center md:text-center md:p-8"
				>
					<LawIcon class="aspect-square w-6 h-auto md:w-8 opacity-30" />
					<span class="flex-1 flex flex-col gap-1 opacity-30">
						<span class="fluid-heading-03">การออกกฏหมาย</span>
						<span>ติดตามร่างกฏหมายที่เกี่ยวข้องกับชีวิตคุณ</span>
					</span>
					<span class="label-01 whitespace-nowrap">เร็วๆ นี้..</span>
				</span>
			</li>
		</menu>
	</nav>
</div>
<section class="bg-ui-01 text-text-01">
	<div class="max-w-[1280px] mx-auto px-4 py-[72px] flex flex-col gap-6">
		<div id="politician" class="flex flex-col gap-2 items-start md:flex-row">
			<div class="flex gap-2 items-center md:flex-1">
				<PoliticianIcon width="32" height="32" />
				<h2 class="fluid-heading-05">นักการเมือง</h2>
			</div>
			<p class="md:flex-1 body-01">
				รู้หน้า รู้ชื่อ แต่ไม่รู้จัก ลองค้นหาประวัติผู้แทนในสภาของเรากันดู มีตั้งแต่ข้อมูลพื้นฐาน
				ข้อมูลทรัพย์สิน-หนี้สิน ประวัติทางการเมือง ไปจนถึงผลงานในสภา
			</p>
		</div>
		<div class="relative">
			<SearchInput
				as={Search}
				size="lg"
				placeholder="ค้นด้วยชื่อ-นามสกุล เช่น ประวิตร, ชลน่าน, ชัยธวัช"
				{searchIndexes}
				bind:searchResults
			/>
			{#if searchResults}
				<SearchResult {searchResults} class="w-full absolute left-0" />
			{/if}
		</div>
		<section>
			<h3 class="fluid-heading-04">นักการเมืองที่น่าสนใจ</h3>
			<p class="label-01 text-gray-60 mb-6">
				หมายเหตุ : ในกรณีที่มีมากกว่า 1 คน จะเลือกจากลำดับตัวอักษรในชื่อ
			</p>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
				{#each highlightedPoliticians as politicianData (politicianData.reason)}
					<StatCard {politicianData} />
				{/each}
			</div>
		</section>
		<section>
			<h3 class="heading-01 text-center mb-6 relative">
				<span class="absolute w-full h-[1px] bg-text-03 left-0 top-1/2" aria-hidden="true" />
				<span class="relative text-text-03 bg-ui-01 px-2 z-10">คัดเลือกโดยใช้แหล่งข้อมูลอื่นๆ</span>
			</h3>
			<Carousel>
				{#each otherSourcesHighlightedPoliticians as politicianData (politicianData.reason)}
					<StatCard class="keen-slider__slide" {politicianData} />
				{/each}
			</Carousel>
		</section>
		<ul class="flex flex-col gap-[6px]">
			<li>
				<Button
					href="/assemblies/สมาชิกสภาผู้แทนราษฎร-25"
					kind="secondary"
					icon={ArrowRight}
					class="w-full max-w-none"
				>
					สมาชิกสภาผู้แทนราษฎร (สส.) ทั้งหมด
				</Button>
			</li>
			<li>
				<Button
					href="/assemblies/วุฒิสภา-12"
					kind="secondary"
					icon={ArrowRight}
					class="w-full max-w-none">สมาชิกวุฒิสภา (สว.) ทั้งหมด</Button
				>
			</li>
			<!-- TODO: cabinet is not released in the 1st phase  -->
			<!-- <li>
				<Button href="/" kind="secondary" icon={ArrowRight} class="w-full max-w-none"
					>คณะรัฐมนตรี (ครม.) ทั้งหมด</Button
				>
			</li> -->
		</ul>
	</div>
</section>
<BackToTopButton />
