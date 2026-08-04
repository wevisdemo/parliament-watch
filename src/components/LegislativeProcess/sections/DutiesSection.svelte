<script lang="ts">
	import type { DutySection } from '../../../routes/legislative-process/+page.server';
	import { DIVIDER_CLASS, HEADING_CLASS, LIST_CLASS, SECTION_CLASS } from '../styles';

	interface Props {
		representatives: DutySection[];
		senates: DutySection[];
		both: DutySection[];
	}

	let { representatives, senates, both }: Props = $props();
</script>

<section class={SECTION_CLASS}>
	<h1 class="fluid-heading-05 {HEADING_CLASS}" id="สส.และ-สว.ทำอะไรบ้างในสภา">
		สส.และ สว.ทำอะไรบ้างในสภา
	</h1>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="หน้าที่ของสมาชิกสภาผู้แทนราษฏร-(สส.)">
			หน้าที่ของสมาชิกสภาผู้แทนราษฏร (สส.)
		</h2>
		<hr class={DIVIDER_CLASS} />
		<div class="flex flex-col gap-2 py-4">
			{#each representatives as section, i (i)}
				<h3 class="fluid-heading-03 {HEADING_CLASS}" id={section.heading}>
					{i + 1}. {section.heading}
				</h3>
				<ul class={LIST_CLASS}>
					{#each section.details as duty (duty)}
						<li>{duty}</li>
					{/each}
				</ul>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="หน้าที่ของสมาชิกวุฒิสภา-(สว.)">
			หน้าที่ของสมาชิกวุฒิสภา (สว.)
		</h2>
		<hr class={DIVIDER_CLASS} />
		<div class="flex flex-col gap-2 py-4">
			{#each senates as section, i (i)}
				<h3 class="fluid-heading-03 {HEADING_CLASS}" id={section.heading}>
					{i + 1}. {section.heading}
				</h3>
				<ul class={LIST_CLASS}>
					{#each section.details as duty (duty)}
						<li>{duty}</li>
					{/each}
				</ul>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="หน้าที่ของสภาร่วม-(สส.-+-สว.)">
			หน้าที่ของสภาร่วม (สส. + สว.)
		</h2>
		<hr class={DIVIDER_CLASS} />
		<p class="pt-4">รัฐสภาจะประชุมร่วมกันได้ต้องเป็นไปตามที่กำหนดไว้ในมาตรา</p>
		<div class="flex flex-col gap-2 py-4">
			{#each both as section, i (i)}
				<h3 class="fluid-heading-03 {HEADING_CLASS}" id={section.heading}>
					{i + 1}. {section.heading}
				</h3>
				<ul class={LIST_CLASS}>
					{#each section.details as duty (duty)}
						<li>{duty}</li>
					{/each}
				</ul>
			{/each}
		</div>
		<hr class={DIVIDER_CLASS} />
	</div>
</section>
