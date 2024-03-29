<script lang="ts">
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import PoliticianContent from '$components/Index/PoliticianContent.svelte';
	import VotingContent from '$components/Index/VotingContent.svelte';
	import SectionMenuItem from '$components/Index/SectionMenuItem.svelte';
	import BillContent from '$components/Index/BillContent.svelte';
	import ContentSection from '$components/Index/ContentSection.svelte';
	import { SearchIndexCategory } from '$models/search.js';

	export let data;

	$: ({
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians,
		latestVotings,
		billsByStatus,
		billsByCategory
	} = data);
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
			<SectionMenuItem
				title="นักการเมือง"
				description="ส่องประวัติและผลงานของคนที่คุณสนใจ"
				icon={PoliticianIcon}
				href="#politician"
			/>
			<SectionMenuItem
				title="การลงมติ"
				description="ดูผลการโหวต พร้อมคำอธิบายเข้าใจง่าย"
				icon={VoteIcon}
				href="#voting"
			/>
			<SectionMenuItem
				title="การออกกฎหมาย"
				description="ติดตามร่างกฎหมายที่เกี่ยวข้องกับชีวิตคุณ"
				icon={LawIcon}
				href="#bill"
			/>
		</menu>
	</nav>
</div>

<ContentSection
	id="politician"
	title="นักการเมือง"
	description="รู้หน้า รู้ชื่อ แต่ไม่รู้จัก ลองค้นหาประวัติผู้แทนในสภาของเรากันดู มีตั้งแต่ข้อมูลพื้นฐาน
ข้อมูลทรัพย์สิน-หนี้สิน ประวัติทางการเมือง ไปจนถึงผลงานในสภา"
	icon={PoliticianIcon}
	searchPlaceholder="ค้นด้วยชื่อ-นามสกุล เช่น ประวิตร, ชลน่าน, ชัยธวัช"
	seachCategories={[SearchIndexCategory.Politicians]}
	class="bg-ui-01"
>
	<PoliticianContent {highlightedPoliticians} {otherSourcesHighlightedPoliticians} />
</ContentSection>

<ContentSection
	id="voting"
	title="การลงมติ"
	description="ใครหนุน ใครค้าน ดูการโหวตครั้งสำคัญในสภา พร้อมคำอธิบายแบบเข้าใจง่ายๆ"
	icon={VoteIcon}
	searchPlaceholder="ค้นด้วยชื่อมติ เช่น อภิปรายไม่ไว้วางใจ, แก้ รธน."
	seachCategories={[SearchIndexCategory.Votings]}
	class="bg-white"
>
	<VotingContent {latestVotings} />
</ContentSection>

<ContentSection
	id="voting"
	title=""
	description=""
	icon={LawIcon}
	searchPlaceholder=""
	seachCategories={[SearchIndexCategory.Bills]}
	class="bg-ui-01"
>
	<BillContent {billsByStatus} {billsByCategory} />
</ContentSection>

<BackToTopButton />
