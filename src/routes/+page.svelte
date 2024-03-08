<script lang="ts">
	import { Button, InlineLoading, Search } from 'carbon-components-svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';
	import Carousel from '$components/Index/Carousel.svelte';
	import StatCard, {
		HighlightedReason,
		type HighlightedPolitician
	} from '$components/Index/StatCard.svelte';
	import SearchInput from '$components/SearchInput/SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import { SearchIndexCategory, type SearchResults } from '$models/search';
	import { fetchExternalPoliticianRanking } from '$lib/politician-ranking/index.js';

	interface MostVisitedInWikipediaLastMonthPolitician extends HighlightedPolitician {
		updatedAt: Date;
	}

	export let data;
	$: ({ highlightedPoliticians, otherSourcesHighlightedPoliticians, latestVotings } = data);

	let politicianSearchResults: SearchResults | null;
	let votingSearchResults: SearchResults | null;
	let externalHighlightedPoliticians: HighlightedPolitician[] = [];

	async function getExternalHighlightedPoliticians(): Promise<HighlightedPolitician[]> {
		const { politicianWithMostWikipediaVisit, politicianWithMostGun, updatedAt } =
			await fetchExternalPoliticianRanking();

		return [
			{
				reason: HighlightedReason.MostVisitedInWikipediaLastMonth,
				...politicianWithMostWikipediaVisit,
				updatedAt
			} as MostVisitedInWikipediaLastMonthPolitician,
			{
				reason: HighlightedReason.MostGunOwned,
				...politicianWithMostGun
			}
		];
	}
</script>

<div class="flex flex-col md:h-[calc(100lvh-48px)]">
	<header
		class="relative flex h-[400px] flex-col items-center justify-center gap-[10px] overflow-hidden bg-gradient-to-t from-[#CCEEFF] to-[#FDFEFF] px-4 md:h-auto md:flex-1"
	>
		<img
			class="absolute bottom-0 left-1/2 h-auto w-full max-w-[1280px] -translate-x-1/2"
			src="/images/sapasathan.svg"
			alt=""
			width="634"
			height="153"
			loading="eager"
			decoding="async"
		/>
		<h1 class="fluid-display-01 relative max-w-[1280px] text-center" style="text-wrap:balance">
			<span class="whitespace-nowrap">ขับเคลื่อน</span><span class="whitespace-nowrap"
				>ประชาธิปไตย</span
			> <br class="hidden md:block" /><span class="whitespace-nowrap">ร่วมเฝ้าดู</span><span
				class="whitespace-nowrap">ความเคลื่อนไหว</span
			><span class="whitespace-nowrap">รัฐสภา</span>
		</h1>
		<p class="helper-text-01 relative flex gap-[10px] text-gray-60">
			<span
				>อัพเดตข้อมูล : {new Date().toLocaleDateString('th-TH', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}</span
			>
			<!-- TODO: Add link -->
			<!-- <a href="/" class="underline text-[color:inherit]">ที่มาและข้อจำกัดข้อมูล</a> -->
		</p>
	</header>
	<nav>
		<menu class="mx-auto flex max-w-[1280px] flex-col md:flex-row">
			<li class="flex-1">
				<a
					href="#politician"
					class="body-01 flex items-start gap-3 bg-white p-4 text-[color:inherit] !no-underline hover:bg-ui-01 md:flex-col md:items-center md:gap-1 md:p-8 md:text-center"
				>
					<PoliticianIcon class="aspect-square h-auto w-6 md:w-8" />
					<span class="flex flex-1 flex-col gap-1">
						<span class="fluid-heading-03">นักการเมือง</span>
						<span>ส่องประวัติและผลงานของคนที่คุณสนใจ</span>
					</span>
					<ArrowDown />
				</a>
			</li>
			<li class="flex-1">
				<a
					href="#votings"
					class="body-01 flex items-start gap-3 bg-white p-4 text-[color:inherit] !no-underline hover:bg-ui-01 md:flex-col md:items-center md:gap-1 md:p-8 md:text-center"
				>
					<VoteIcon class="aspect-square h-auto w-6 md:w-8" />
					<span class="flex flex-1 flex-col gap-1">
						<span class="fluid-heading-03">การลงมติ</span>
						<span>ดูผลการโหวต พร้อมคำอธิบายเข้าใจง่าย</span>
					</span>
					<ArrowDown />
				</a>
			</li>
			<li class="flex-1">
				<span
					class="body-01 flex items-start gap-3 bg-white p-4 text-[color:inherit] md:flex-col md:items-center md:gap-1 md:p-8 md:text-center"
				>
					<LawIcon class="aspect-square h-auto w-6 opacity-30 md:w-8" />
					<span class="flex flex-1 flex-col gap-1 opacity-30">
						<span class="fluid-heading-03">การออกกฎหมาย</span>
						<span>ติดตามร่างกฎหมายที่เกี่ยวข้องกับชีวิตคุณ</span>
					</span>
					<span class="label-01 whitespace-nowrap">เร็วๆ นี้..</span>
				</span>
			</li>
		</menu>
	</nav>
</div>
<section id="politician" class="bg-ui-01 text-text-01">
	<div class="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-[72px]">
		<div class="flex flex-col items-start gap-2 md:flex-row">
			<div class="flex items-center gap-2 md:flex-1">
				<PoliticianIcon width="32" height="32" />
				<h2 class="fluid-heading-05">นักการเมือง</h2>
			</div>
			<p class="body-01 md:flex-1">
				รู้หน้า รู้ชื่อ แต่ไม่รู้จัก ลองค้นหาประวัติผู้แทนในสภาของเรากันดู มีตั้งแต่ข้อมูลพื้นฐาน
				ข้อมูลทรัพย์สิน-หนี้สิน ประวัติทางการเมือง ไปจนถึงผลงานในสภา
			</p>
		</div>
		<div class="relative">
			<SearchInput
				as={Search}
				size="lg"
				placeholder="ค้นด้วยชื่อ-นามสกุล เช่น ประวิตร, ชลน่าน, ชัยธวัช"
				categories={[SearchIndexCategory.Politicians]}
				bind:searchResults={politicianSearchResults}
			/>
			{#if politicianSearchResults}
				<SearchResult searchResults={politicianSearchResults} class="absolute left-0 z-10 w-full" />
			{/if}
		</div>
		<section>
			<h3 class="fluid-heading-04">นักการเมืองชุดล่าสุดที่น่าสนใจ</h3>
			<p class="label-01 mb-6 text-gray-60">
				หมายเหตุ : ในกรณีที่มีมากกว่า 1 คน จะเลือกจากลำดับตัวอักษรในชื่อ
			</p>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
				{#each highlightedPoliticians as politicianData (politicianData.reason)}
					<StatCard {politicianData} />
				{/each}
			</div>
		</section>
		<section>
			<h3 class="heading-01 relative mb-6 text-center">
				<span class="absolute left-0 top-1/2 h-[1px] w-full bg-text-03" aria-hidden="true" />
				<span class="relative z-10 bg-ui-01 px-2 text-text-03">คัดเลือกโดยใช้แหล่งข้อมูลอื่นๆ</span>
			</h3>
			{#await getExternalHighlightedPoliticians()}
				<InlineLoading class="flex items-center justify-center p-12" />
			{:then externalHighlightedPoliticians}
				<Carousel
					arrowLeftClass="top-auto bottom-[75px] translate-y-1/2"
					arrowRightClass="top-auto bottom-[75px] translate-y-1/2"
				>
					{#each [...otherSourcesHighlightedPoliticians, ...externalHighlightedPoliticians] as politicianData (politicianData.reason)}
						<StatCard class="keen-slider__slide" {politicianData} />
					{/each}
				</Carousel>
			{/await}
		</section>
		<div class="flex flex-col gap-[6px]">
			<Button
				href="/assemblies/สภาผู้แทนราษฎร-26"
				kind="secondary"
				icon={ArrowRight}
				class="w-full max-w-none"
			>
				สมาชิกสภาผู้แทนราษฎร (สส.) ทั้งหมด
			</Button>

			<Button
				href="/assemblies/วุฒิสภา-12"
				kind="secondary"
				icon={ArrowRight}
				class="w-full max-w-none">สมาชิกวุฒิสภา (สว.) ทั้งหมด</Button
			>
			<!-- TODO: cabinet is not released in the 1st phase  -->
			<!-- <li>
				<Button href="/" kind="secondary" icon={ArrowRight} class="w-full max-w-none"
					>คณะรัฐมนตรี (ครม.) ทั้งหมด</Button
				>
			</li> -->
		</div>
	</div>
</section>
<section id="votings" class="bg-white text-text-01">
	<div class="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-[72px]">
		<div class="flex flex-col items-start gap-2 md:flex-row">
			<div class="flex items-center gap-2 md:flex-1">
				<VoteIcon width="32" height="32" />
				<h2 class="fluid-heading-05">การลงมติ</h2>
			</div>
			<p class="body-01 md:flex-1">
				ใครหนุน ใครค้าน ดูการโหวตครั้งสำคัญในสภา พร้อมคำอธิบายแบบเข้าใจง่ายๆ
			</p>
		</div>
		<div class="relative">
			<SearchInput
				as={Search}
				size="lg"
				placeholder="ค้นด้วยชื่อมติ เช่น อภิปรายไม่ไว้วางใจ, แก้ รธน."
				categories={[SearchIndexCategory.Votings]}
				bind:searchResults={votingSearchResults}
			/>
			{#if votingSearchResults}
				<SearchResult searchResults={votingSearchResults} class="absolute left-0 z-10 w-full" />
			{/if}
		</div>
		<section>
			<h3 class="fluid-heading-04 mb-4">{latestVotings.length} ผลการลงมติล่าสุด</h3>
			<Carousel options={{ loop: false }}>
				{#each latestVotings as { voting, highlightedVoteByGroups }}
					<VoteCard class="keen-slider__slide" {voting} {highlightedVoteByGroups} />
				{/each}
			</Carousel>
		</section>
		<div class="flex flex-col gap-[6px]">
			<Button
				href="/assemblies/สภาผู้แทนราษฎร-26/votes"
				kind="secondary"
				icon={ArrowRight}
				class="w-full max-w-none"
			>
				ดูการลงมติทั้งหมดของสมาชิกสภาผู้แทนราษฎร ชุดที่ 26
			</Button>
			<Button
				href="/assemblies/วุฒิสภา-12/votes"
				kind="secondary"
				icon={ArrowRight}
				class="w-full max-w-none"
			>
				ดูการลงมติทั้งหมดของสมาชิกวุฒิสภา ชุดที่ 12
			</Button>
		</div>
	</div>
</section>
<BackToTopButton />
