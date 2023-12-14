<script lang="ts">
	import SideNav from '$components/LegislativeProcess/Sidebar.svelte';
	import { Button } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import scrollama from 'scrollama';

	export let data;

	const sections = [
		{ menu: 'เกี่ยวกับเว็บไซต์นี้', menuItem: [{ text: 'ทีมงานร่วมพัฒนา' }] },
		{ menu: 'เกี่ยวกับข้อมูลในเว็บไซต์', menuItem: [{ text: 'นโยบายการนำข้อมูลไปใช้ต่อ' }] },
		{
			menu: 'เกี่ยวกับ WeVis',
			menuItem: [
				{ text: 'Who We Are' },
				{ text: 'What We Do' },
				{ text: 'Support Us and Stay Connected' }
			]
		}
	];

	let contentContainer: HTMLElement;
	let currentNavElementId: string = sections[0].menu;
	onMount(() => {
		if (window.matchMedia('(min-width: 672px)').matches) {
			const scroller = scrollama();

			scroller
				.setup({
					step: contentContainer.querySelectorAll('h2,h3'),
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '49px'
				})
				.onStepEnter((response) => {
					currentNavElementId = response.element.id;
				});

			return scroller.destroy;
		}
	});
</script>

<div class="h-[160px] flex items-center justify-center">
	<h1 class="fluid-heading-05 font-bold">เกี่ยวกับเรา</h1>
</div>
<div class="flex flex-col md:flex-row">
	<div class="p-4 flex-none">
		<SideNav
			class="top-0 w-full max-w-none md:w-[16rem] md:max-w-[16rem] [&>ul]:pt-0 [&>ul]:bg-ui-01 md:[&>ul]:bg-white/0"
			{sections}
			{currentNavElementId}
		/>
	</div>
	<div bind:this={contentContainer} class="flex-1 px-4 py-6 body-02 md:px-16">
		<section class="flex flex-col gap-2">
			<h2 id="เกี่ยวกับเว็บไซต์นี้" class="fluid-heading-04">เกี่ยวกับเว็บไซต์นี้</h2>
			<hr class="border-t border-t-solid border-t-ui-03 my-2" role="none" />
			<p>
				การเลือกตั้งเป็นกลไกสำคัญในการขับเคลื่อนประชาธิปไตย และ ‘ผู้แทน’ ที่มาจากกลไกการเลือกตั้ง
				(หรือการแต่งตั้ง) จำเป็นต้องทำหน้าที่อย่างเต็มที่เพื่อประชาชน
			</p>
			<p>
				แต่อุปสรรคสำคัญในการชี้วัดว่า ‘ผู้แทน’ ของประชาชนได้ทำหน้าที่อย่างเต็มที่หรือไม่นั้น
				คือข้อมูลและเครื่องมือในการติดตามและตรวจสอบการทำงานของรัฐสภาอย่างเป็นระบบ
				สาเหตุหนึ่งอาจเป็นเพราะข้อมูลและเครื่องมือต่างๆ ของรัฐอยู่ในรูปแบบที่ซับซ้อน กระจัดกระจาย
				และใช้งานยาก
			</p>
			<p>
				WeVis เชื่อว่าการมีส่วนร่วมทางการเมืองของประชาชนไม่ได้จบลงที่การเลือกตั้ง
				เราจึงตั้งใจพัฒนาโปรเจกต์ <strong>Parliament Watch</strong>
				ให้เป็นแพลตฟอร์มที่เปิดช่องทางให้ประชาชนและสื่อมวลชนสามารถจับตาดูการทำงานของ ‘รัฐสภา’ ผ่าน
			</p>
			<ul class="list-disc">
				<li>
					<strong>กระบวนการการออกกฎหมาย</strong> ว่าแต่ละร่างกฎหมายเมื่อเข้าสู่รัฐสภาแล้ว ต้องถูกพิจารณากี่ลำดับขั้น
					และร่างกฎหมายแต่ละฉบับกำลังถูกพิจารณาอยู่ในขั้นตอนใด
				</li>
				<li>
					<strong>การทำงานของสมาชิกรัฐสภารายบุคคล</strong> ว่าเป็นใคร ทำหน้าที่อะไร เคยให้คำสัญญาอะไรไว้กับประชาชน
					และเสนอโหวตประเด็นใดในสภาไปแล้วบ้าง เพื่อเปลี่ยนข้อมูลที่เป็นของเราทุกคน ให้อยู่ในรูปแบบที่เข้าถึงและเข้าใจได้ง่ายขึ้น
				</li>
				<li>
					<strong>การติดตามความสำเร็จของนโยบายของพรรคการเมือง</strong>
					เพื่อดูว่าคำสัญญาหรือนโยบายที่หาเสียงที่ให้ไว้ในช่วงเลือกตั้ง เมื่อผ่านช่วงเวลาการทำงานในรัฐสภา
					(หรือทำเนียบ) ไปแล้ว สามารถทำได้จริงมากน้อยแค่ไหน
				</li>
			</ul>
			<h3 id="ทีมงานร่วมพัฒนา" class="fluid-heading-03">ทีมงานร่วมพัฒนา</h3>
			<div>
				<strong class="block">เขียนโปรแกรม</strong>
				<ul class="name-list">
					{#each data.developers as { username, url } (username)}
						<li><a href={url} target="_blank" rel="nofollow noopener noreferrer">{username}</a></li>
					{/each}
				</ul>
			</div>
			<div>
				<strong class="block">ออกแบบ</strong>
				<ul class="name-list">
					<li>น้ำใส ศุภวงศ์</li>
					<li>พิชญา โชนะโต</li>
					<li>มนสิชา ศรีสวนแตง</li>
				</ul>
			</div>
			<div>
				<strong class="block">สืบค้นและรวบรวมข้อมูล</strong>
				<ul class="name-list">
					<li>อาลาวีย์ วาแม</li>
					<li>ภัณฑิรา มั่นสัมฤทธิ์</li>
				</ul>
			</div>
			<div>
				<strong class="block">ผู้จัดการโครงการ</strong>
				<ul class="name-list">
					<li>ธนิสรา เรืองเดช</li>
					<li>ศุภวิชญ์ พิพัฒน์</li>
				</ul>
			</div>
			<div>
				<strong class="block mb-1">หมายเหตุ</strong>
				<p>
					โครงการนี้ <a
						href="https://wevis.info/"
						target="_blank"
						rel="nofollow noopener noreferrer">WeVis</a
					>
					ได้รับการสนับสนุนทุนในการดำเนินงานจาก
					<a href="https://www.ned.org/" target="_blank" rel="nofollow noopener noreferrer"
						>National Endowment for Democracy (NED)</a
					>
					<a
						href="https://www.opensocietyfoundations.org/"
						target="_blank"
						rel="nofollow noopener noreferrer">Open Society Foundations</a
					>
					และ
					<a
						href="https://www.opensocietyfoundations.org/"
						target="_blank"
						rel="nofollow noopener noreferrer"
						>กองทุนรวม<span class="whitespace-nowrap">ธรรมาภิบาลไทย</span> (CG Fund)</a
					> ซึ่งนำมาใช้เป็นต้นทุนในการรวมรวมข้อมูล ออกแบบ พัฒนาเว็บไซต์ ประสานงาน บริหารจัดการ ตลอดจนการจัด
					Meetup เพื่อดำเนินโครงการ
				</p>
			</div>
			<div class="flex gap-2 flex-wrap">
				<Button href="https://wevis.info/downloads">ดาวน์โหลดข้อมูล</Button>
				<Button kind="tertiary" href="https://airtable.com/shryu4errnlj1LWsM"
					>เสนอแนะเพิ่มเติม</Button
				>
			</div>
		</section>
	</div>
</div>

<style lang="postcss">
	ul.list-disc {
		@apply ml-[2ch];
	}

	ul.name-list {
		@apply flex flex-wrap gap-x-1;

		& > li:not(:last-child)::after {
			content: ',';
		}
	}

	a {
		@apply underline;
		color: inherit;
	}
</style>
