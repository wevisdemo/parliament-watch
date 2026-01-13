<script lang="ts">
	import WevisLogo from '$components/About/WevisLogo.svelte';
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';
	import SideNav from '$components/LegislativeProcess/Sidebar.svelte';
	import FacebookIcon from '$components/icons/FacebookIcon.svelte';
	import GithubIcon from '$components/icons/GithubIcon.svelte';
	import InstagramIcon from '$components/icons/InstagramIcon.svelte';
	import XIcon from '$components/icons/XIcon.svelte';
	import { Button } from 'carbon-components-svelte';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';

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

<div class="flex h-[160px] items-center justify-center">
	<h1 class="fluid-heading-05 font-bold">เกี่ยวกับเรา</h1>
</div>
<div class="flex flex-col md:flex-row">
	<div class="flex-none p-4 md:sticky md:top-12 md:self-start">
		<SideNav
			class="top-0 w-full max-w-none md:w-[16rem] md:max-w-[16rem] [&>ul]:bg-ui-01 [&>ul]:pt-0 md:[&>ul]:bg-white/0"
			{sections}
			{currentNavElementId}
		/>
	</div>
	<div bind:this={contentContainer} class="body-02 flex-1 px-4 md:px-16">
		<section class="flex flex-col gap-2 py-6 md:pb-9">
			<h2 id="เกี่ยวกับเว็บไซต์นี้" class="fluid-heading-04">เกี่ยวกับเว็บไซต์นี้</h2>
			<hr class="border-t-solid my-2 border-t border-t-ui-03" role="none" />
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
					<strong>การลงมติ</strong> ว่ามีวาระอะไรที่เกิดขึ้นการบ้างในการประชุมสภา การลงมติเป็นขั้นตอนสำคัญของกระบวนการพิจารณาร่างกฎหมาย
					และเป็นหน้าที่โดยตรงของสมาชิกรัฐสภาทุกคน
				</li>
				<li>
					<strong>การทำงานของสมาชิกรัฐสภารายบุคคล</strong> ว่าเป็นใคร ทำหน้าที่อะไร เคยให้คำสัญญาอะไรไว้กับประชาชน
					และเสนอโหวตประเด็นใดในสภาไปแล้วบ้าง เพื่อเปลี่ยนข้อมูลที่เป็นของเราทุกคน ให้อยู่ในรูปแบบที่เข้าถึงและเข้าใจได้ง่ายขึ้น
				</li>
			</ul>
			<h3 id="ทีมงานร่วมพัฒนา" class="fluid-heading-03 mt-2">ทีมงานร่วมพัฒนา</h3>
			<div class="mt-2">
				<strong class="block">เขียนโปรแกรม</strong>
				<ul class="name-list">
					{#each data.developers as { username, url } (username)}
						<li><a href={url} target="_blank" rel="nofollow noopener noreferrer">{username}</a></li>
					{/each}
				</ul>
			</div>
			<div class="mt-2">
				<strong class="block">ออกแบบ</strong>
				<ul class="name-list">
					<li>น้ำใส ศุภวงศ์</li>
					<li>พิชญา โชนะโต</li>
					<li>มนสิชา ศรีสวนแตง</li>
				</ul>
			</div>
			<div class="mt-2">
				<strong class="block">สืบค้นและรวบรวมข้อมูล</strong>
				<ul class="name-list">
					<li>อาลาวีย์ วาแม</li>
					<li>ภัณฑิรา มั่นสัมฤทธิ์</li>
				</ul>
			</div>
			<div class="mt-2">
				<strong class="block">ผู้จัดการโครงการ</strong>
				<ul class="name-list">
					<li>ธนิสรา เรืองเดช</li>
					<li>ศุภวิชญ์ พิพัฒน์</li>
				</ul>
			</div>
			<div class="mt-2">
				<strong class="mb-1 block">หมายเหตุ</strong>
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
					> ซึ่งนำมาใช้เป็นต้นทุนในการรวบรวมข้อมูล ออกแบบ พัฒนาเว็บไซต์ ประสานงาน บริหารจัดการ ตลอดจนการจัด
					Meetup เพื่อดำเนินโครงการ
				</p>
			</div>
		</section>
		<section class="flex flex-col gap-2 py-6 md:py-9">
			<h2 id="เกี่ยวกับข้อมูลในเว็บไซต์" class="fluid-heading-04">เกี่ยวกับข้อมูลในเว็บไซต์</h2>
			<hr class="border-t-solid my-2 border-t border-t-ui-03" role="none" />
			<h3 id="นโยบายการนำข้อมูลไปใช้ต่อ" class="fluid-heading-03 mt-2">
				นโยบายการนำข้อมูลไปใช้ต่อ
			</h3>
			<p>
				ทางทีมมีความตั้งใจที่จะพัฒนาทุกโปรเจกต์ให้เป็น Open Source และเปิดข้อมูลเป็น Open Data
				ภายใต้เงื่อนไข <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
					Creative Commons Attribution-NonCommercial-ShareAlike License</a
				>
				คือสามารถนำไปเผยแพร่และดัดแปลงได้ โดยต้องระบุที่มา แต่ห้ามนำไปใช้เพื่อการค้า และต้องเผยแพร่งานดัดแปลงโดยใช้สัญญาอนุญาตชนิดเดียวกัน
			</p>
			<p>
				ข้อมูลทั้งหมดภายในเว็บไซต์ถูกรวบจากช่องทางต่างๆ ภายใต้ข้อจำกัดในหลายๆ ด้าน ทาง WeVis
				ไม่สามารถรับผิดชอบต่อผลกระทบใดๆ หากมีข้อมูลที่ผิดพลาดหรือไม่อัปเดตล่าสุด
				หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม
				ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง หรือมีข้อเสนอแนะใดๆ
				สามารถติดต่อได้ที่ <strong class="font-normal text-blue-60">team@wevis.info</strong>
			</p>
		</section>
		<section class="flex flex-col gap-2 py-6 md:py-9">
			<h2 id="เกี่ยวกับ-WeVis" class="fluid-heading-04">เกี่ยวกับ WeVis</h2>
			<hr class="border-t-solid my-2 border-t border-t-ui-03" role="none" />
			<WevisLogo />
			<h3 id="Who-We-Are" class="fluid-heading-03 mt-2">Who We Are</h3>
			<p>
				พวกเราคือกลุ่มเทคโนโลยีภาคประชาชน (Civic Technology)
				ที่พยายามขับเคลื่อนสังคมผ่านเทคโนโลยีและข้อมูลเปิด (Open Data)
				ภารกิจของเราคือการทำให้ประชาธิปไตยไทยเปิดเผย โปร่งใส และมีส่วนร่วมได้
			</p>
			<p>
				ทีมงานบางส่วนของ WeVis ได้ร่วมริเริ่มโครงการทดลอง <strong>ELECT</strong>
				(<a href="https://elect.in.th/">elect.in.th</a>) เมื่อปลายปี 2018
				ด้วยความต้องการที่จะค้นหาและทดลองใช้วิธีการนำเสนอข้อมูลข่าวสารด้านการเมืองแบบใหม่ๆ
				เกี่ยวกับการเลือกตั้ง ’62 จนเมื่อปี 2021 ได้มีการปรับวิธีทำงานให้เป็นมากกว่าสื่อ และใช้ชื่อ
				<strong>WeVis</strong> เพื่อให้ครอบคลุมประเด็นทางการเมืองที่มากไปกว่าการเลือกตั้ง
			</p>
			<p>
				<strong>WeVis</strong> พัฒนาเครื่องมือในรูปแบบต่างๆ เพื่อเปิดเผยและสื่อสารข้อมูลการเมือง
				เพื่อสร้างการมีส่วนร่วมบนเว็บไซต์
				<a href="https://wevis.info/" target="_blank" rel="nofollow noopener noreferrer"
					>wevis.info</a
				> มาตลอดหลายปี โดยเปิดพื้นที่ให้บุคคลและองค์กร ทั้งภาครัฐและเอกชน สามารถเข้ามามีส่วนร่วมในการพัฒนาแต่ละโปรเจกต์ได้
			</p>
			<h3 id="What-We-Do" class="fluid-heading-03 mt-2">What We Do</h3>
			<p>
				ทีม WeVis ซึ่งประกอบไปด้วยกลุ่มคนและอาสาสมัครจากหลากหลายสาขาอาชีพ
				แต่มีความสนใจและเป้าหมายร่วมกัน ได้พยายามคัดสรร วิเคราะห์
				และแสดงข้อมูลเกี่ยวกับสังคมการเมือง เปิดเผยผ่านแพลตฟอร์มที่สร้างขึ้น
				เพื่อให้ประชาชนสามารถมีส่วนร่วม ตัดสินใจ และแสดงความคิดเห็นบนพื้นฐานของข้อมูลที่เข้าถึง
				เข้าใจ และเข้าใช้ง่าย โดยเปิดเผยข้อมูลทั้งหมดเป็นข้อมูลเปิด (Open Data) และ Source Code
				ทั้งหมด ให้นำไปใช้ต่อได้เพื่อประโยชน์สาธารณะ
			</p>
			<p>
				นอกจากนี้ เรายังพยายามทำงานร่วมกับหลายหน่วยงานภาคประชาชนและภาครัฐ
				เพื่อสร้างการเปลี่ยนแปลงเชิงนโยบายและโครงสร้างพื้นฐานด้านการใช้เทคโนโลยีและข้อมูลเปิดไปพร้อมกัน
			</p>
			<p>
				หนึ่งในความเชื่อของพวกเราคือ ประชาชนสามารถทำงานร่วมกับรัฐเพื่อพัฒนาสังคมให้ดีขึ้นได้
				และหลายปัญหาในสังคมแก้ได้ด้วยการเปิดเผยข้อมูล ดังนั้น
				จึงควรมีพื้นที่ให้ประชาชนติดตามตรวจสอบข้อมูล แสดงความคิดเห็น
				และมีส่วนร่วมในการตัดสินใจเกี่ยวกับการทำงานและนโยบายต่างๆ ของรัฐ
			</p>
			<h3 id="Support-Us-and-Stay-Connected" class="fluid-heading-03 mt-2">
				Support Us and Stay Connected
			</h3>
			<p>
				คุณสามารถเป็นส่วนหนึ่งในการพัฒนาเทคโนโลยีภาคประชาชน (Civic Technology) ร่วมกับเราได้
				โดยแจ้งความประสงค์ร่วมพัฒนาโปรเจกต์ ส่งความคิดเห็น เสนอไอเดีย แจ้งเปลี่ยน / อัปเดตข้อมูล
				หรือมีข้อสงสัยอยากสอบถาม ได้ทาง feedback form หรือ GithHub repository ข้างล่างนี้
				และสามารถติดตามผลงานของ WeVis ได้ทุกช่องทาง Social Media
			</p>
			<div class="mt-2 flex flex-wrap items-center gap-2">
				<Button
					class="w-full max-w-max"
					href="https://airtable.com/shryu4errnlj1LWsM"
					target="_blank">พบข้อผิดพลาดหรือมีไอเดีย? บอกเราเลย</Button
				>
				<ul class="flex items-center gap-2">
					<li>
						<a
							href="https://github.com/wevisdemo/parliament-watch"
							target="_blank"
							rel="nofollow noopener noreferrer"
							aria-label="GitHub Repository"
						>
							<GithubIcon size={32} />
						</a>
					</li>
					<li>
						<a
							href="https://www.facebook.com/wevisdemo"
							target="_blank"
							rel="nofollow noopener noreferrer"
							aria-label="Facebook"
						>
							<FacebookIcon size={32} />
						</a>
					</li>
					<li>
						<a
							href="https://www.instagram.com/wevisdemo/"
							target="_blank"
							rel="nofollow noopener noreferrer"
							aria-label="Instagram"
						>
							<InstagramIcon size={32} />
						</a>
					</li>
					<li>
						<a
							href="https://x.com/wevisdemo"
							target="_blank"
							rel="nofollow noopener noreferrer"
							aria-label="X"
						>
							<XIcon size={32} />
						</a>
					</li>
				</ul>
			</div>
		</section>
	</div>
</div>
<BackToTopButton />

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
