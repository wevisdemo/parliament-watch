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
	import { ArrowRight } from 'carbon-icons-svelte';
	import DataPeriodRemark from '$components/DataPeriodRemark.svelte';
	import PromiseIcon from '$components/icons/PromiseIcon.svelte';
	import PromiseContent from '$components/Index/PromiseContent.svelte';

	export let data;

	$: ({
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians,
		latestVotings,
		billByCategoryAndStatus,
		promiseSummary
	} = data);
</script>

<div class="flex flex-col md:h-[calc(100lvh-48px)]">
	<header
		class="relative h-[400px] overflow-hidden bg-gradient-to-t from-[#CCEEFF] to-[#FDFEFF] md:h-auto md:flex-1"
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
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-[10px] px-4">
			<h1 class="fluid-display-01 relative max-w-[1280px] text-center" style="text-wrap:balance">
				<span class="whitespace-nowrap">ขับเคลื่อน</span><span class="whitespace-nowrap"
					>ประชาธิปไตย</span
				> <br class="hidden md:block" /><span class="whitespace-nowrap">ร่วมเฝ้าดู</span><span
					class="whitespace-nowrap">ความเคลื่อนไหว</span
				><span class="whitespace-nowrap">รัฐสภา</span>
			</h1>
			<DataPeriodRemark withStartDate />
		</div>
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
				title="การเสนอกฎหมาย"
				description="ติดตามร่างกฎหมายที่เกี่ยวข้องกับชีวิตคุณ"
				icon={LawIcon}
				href="#bill"
			/>
			<SectionMenuItem
				title="คำสัญญาทางการเมือง"
				description="ติดตามความคืบหน้าของนโยบายที่รัฐบาลสัญญาไว้"
				icon={PromiseIcon}
				href="#promise"
			/>
		</menu>
	</nav>
</div>

<ContentSection
	id="politician"
	title="นักการเมือง"
	icon={PoliticianIcon}
	searchPlaceholder="ค้นด้วยชื่อ-นามสกุล เช่น ประวิตร, ชลน่าน, ชัยธวัช"
	searchCategories={[SearchIndexCategory.Politicians]}
	class="bg-ui-01"
>
	<span slot="description"
		>รู้หน้า รู้ชื่อ แต่ไม่รู้จัก ลองค้นหาประวัติผู้แทนในสภาของเรากันดู มีตั้งแต่ข้อมูลพื้นฐาน
		ข้อมูลทรัพย์สิน-หนี้สิน ประวัติทางการเมือง ไปจนถึงผลงานในสภา</span
	>
	<PoliticianContent {highlightedPoliticians} {otherSourcesHighlightedPoliticians} />
</ContentSection>

<ContentSection
	id="voting"
	title="การลงมติ"
	icon={VoteIcon}
	searchPlaceholder="ค้นด้วยชื่อมติ เช่น อภิปรายไม่ไว้วางใจ, แก้ รธน."
	searchCategories={[SearchIndexCategory.Votings]}
	class="bg-white"
>
	<span slot="description"
		>ใครหนุน ใครค้าน ดูการโหวตครั้งสำคัญในสภา พร้อมคำอธิบายแบบเข้าใจง่ายๆ</span
	>
	<VotingContent {latestVotings} />
</ContentSection>

<ContentSection
	id="bill"
	title="การเสนอกฎหมาย"
	icon={LawIcon}
	searchPlaceholder="ค้นด้วยชื่อมติ เช่น อภิปรายไม่ไว้วางใจ, แก้ รธน."
	searchCategories={[SearchIndexCategory.Bills]}
	class="bg-ui-01"
>
	<span slot="description"
		>ติดตามร่างกฏหมายที่เกี่ยวข้องกับชีวิตคุณ สำเร็จ หรือติดค้างอยู่ที่ขั้นตอนไหน<br />
		<a href="/legislative-process" class="mt-1 flex"
			>รัฐออกกฏหมายอย่างไร? <ArrowRight class="ml-1" /></a
		></span
	>
	<BillContent {billByCategoryAndStatus} />
</ContentSection>

<ContentSection
	id="promise"
	title="คำสัญญาทางการเมือง"
	icon={PromiseIcon}
	searchPlaceholder="ค้นหาด้วยคำสัญญา เช่น กระเป๋าเงินดิจิทัล"
	class="bg-ui-white"
>
	<span slot="description"
		>ทุกการเลือกตั้งมาพร้อมคำสัญญาจากพรรคการเมือง แต่พวกเขาทำได้จริงแค่ไหน
		ข้อมูลได้ถูกรวบรวมไว้ให้คุณได้ติดตามและตรวจสอบความคืบหน้าได้ง่ายขึ้น</span
	>
	<PromiseContent {...promiseSummary} />
</ContentSection>

<BackToTopButton />
