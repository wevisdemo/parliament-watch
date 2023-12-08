<script lang="ts">
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import { Accordion, AccordionItem } from 'carbon-components-svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';

	export let data;
</script>

<header
	class="h-[calc(100lvh-48px)] min-h-[340px] bg-gradient-to-t from-[#CCEEFF] to-[#FDFEFF] flex items-center justify-center flex-col gap-[10px] px-4"
>
	<h1 class="fluid-display-01 max-w-[1280px] text-center" style="text-wrap:balance">
		<span class="whitespace-nowrap">ขับเคลื่อน</span><span class="whitespace-nowrap"
			>ประชาธิปไตย</span
		> <br class="hidden md:block" /><span class="whitespace-nowrap">ร่วมเฝ้าดู</span><span
			class="whitespace-nowrap">ความเคลื่อนไหว</span
		><span class="whitespace-nowrap">รัฐสภา</span>
	</h1>
	<p class="flex gap-[10px] helper-text-01 text-gray-60">
		<span>อัปเดตข้อมูล: 18 ส.ค. 2566</span>
		<!-- TODO: Add link -->
		<a href="#source" class="underline text-[color:inherit]">ที่มาและข้อจำกัดข้อมูล</a>
	</p>
	<img class="absolute w-full h-auto bottom-0 left-0" src="/images/sapasathan.svg" alt="" />
</header>
<nav>
	<menu class="max-w-[1280px] mx-auto flex flex-col md:flex-row">
		<li class="flex-1">
			<a
				href="#a"
				class="flex gap-3 items-start p-4 bg-white body-01 text-[color:inherit] md:gap-1 md:flex-col md:items-center md:text-center md:p-8 !no-underline"
			>
				<PoliticianIcon class="aspect-square w-6 h-auto md:w-8" />
				<span class="flex flex-col gap-1">
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
				<span class="flex flex-col gap-1 opacity-30">
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
				<span class="flex flex-col gap-1 opacity-30">
					<span class="fluid-heading-03">การออกกฏหมาย</span>
					<span>ติดตามร่างกฏหมายที่เกี่ยวข้องกับชีวิตคุณ</span>
				</span>
				<span class="label-01 whitespace-nowrap">เร็วๆ นี้..</span>
			</span>
		</li>
	</menu>
</nav>
<section class="bg-ui-01">
	<div class="p-4">
		<Accordion>
			<AccordionItem title="Data"><p>{JSON.stringify(data, null, 2)}</p></AccordionItem>
		</Accordion>
	</div>
</section>

<!-- <div class="p-4 space-y-6">
	<h1 class="fluid-display-01 text-blue-60">Parliament Watch 👀</h1>

	<ul>
		<li>
			<a href="/politicians/กรณิศ-งามสุคนธ์รัตนา"
				>[WEV-12] Users can learn about a politician's details</a
			>
		</li>
		<li>
			[WEV-14] Users can learn more about an assembly
			<ul>
				<li><a href="/assemblies/สมาชิกสภาผู้แทนราษฎร-25">สส.</a></li>
				<li><a href="/assemblies/วุฒิสภา-12">สว.</a></li>
			</ul>
		</li>
		<li>
			<a href="/legislative-process">[WEV-18] Users can learn the legislative process</a>
		</li>
		<li>
			<a href="/votings/1">[WEV-10] Users can view voting details</a>
			<ul>
				<li>
					<a href="/votings/1/votes">votes data table page</a>
				</li>
			</ul>
		</li>
		<li>
			<a href="/bills/1">[WEV-15] Users can view details and track progress of a bill</a>
		</li>
		<li>
			<a href="/bills">[WEV-16] Users can browse for a bill</a>
			<ul>
				<li>
					<a href="/bills/search">bills data table page</a>
				</li>
			</ul>
		</li>
	</ul>
</div> -->
