<script lang="ts">
	import WeVisText from '$components/icons/WeVisText.svelte';
	import { ArrowUpRight } from 'carbon-icons-svelte';
	import FooterContact from './FooterContact.svelte';
	import FooterMenuGroup from './FooterMenuGroup.svelte';
	import { menuList } from '$components/NavigationBar/NavigationBar.svelte';
</script>

<div class="flex flex-col items-center gap-4 bg-white px-6 py-8 text-sm md:px-12 lg:px-16">
	<p class="max-w-[1200px]">
		เว็บไซต์นี้สร้างโดย
		<a
			href="https://wevis.info/"
			target="_blank"
			rel="nofollow noopener noreferrer"
			class="mb-2 flex flex-row items-end"
		>
			<WeVisText width="79px" height="24px" viewBox="0 0 79 24" class="text-black" />
			<ArrowUpRight class="ml-2 text-black" size={16} />
		</a>
		กลุ่มเทคโนโลยีภาคประชาชน (Civic Technology) ที่ขับเคลื่อนสังคมผ่านเทคโนโลยีและข้อมูลเปิด (Open Data)
		ภารกิจของเราคือการทำให้ประชาธิปไตยไทยเปิดเผย โปร่งใส และมีส่วนร่วมได้ เราจึงตั้งใจพัฒนาโปรเจกต์ Parliament
		Watch ให้เป็นแพลตฟอร์มที่เปิดช่องทางให้ประชาชนและสื่อมวลชนสามารถจับตาดูการทำงานของ ‘รัฐสภา’ โดยโครงการนี้ได้รับการสนับสนุนทุนในการดำเนินงานจาก
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
			rel="nofollow noopener noreferrer">กองทุนรวมธรรมาภิบาลไทย (CG Fund)</a
		> ซึ่งนำมาใช้เป็นต้นทุนในการรวมรวมข้อมูล ออกแบบ พัฒนาเว็บไซต์ ประสานงาน บริหารจัดการ ตลอดจนการจัด
		Meetup เพื่อดำเนินโครงการ
	</p>
	<div class="max-w-[1200px]">
		<div class="font-semibold">ข้อตกลงในการใช้งาน (Terms of Use)</div>
		<div>
			ทางทีมมีความตั้งใจที่พัฒนาทุกโปรเจกต์ให้เป็น Open Source และเปิดข้อมูลเป็น Open Data ภายใต้<a
				href="https://wevis.info/terms-of-use/"
				target="_blank"
				rel="nofollow noopener noreferrer">ข้อตกลงในการใช้งาน (Terms of Use)</a
			> ข้อมูลทั้งหมดภายในเว็บไซต์ถูกรวบจากช่องทางต่างๆ ภายใต้ข้อจำกัดในหลายๆ ด้าน ทาง WeVis ไม่สามารถรับผิดชอบต่อผลกระทบใดๆ
			หากมีข้อมูลที่ผิดพลาดหรือไม่อัปเดตล่าสุด หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง
			หรือมีข้อเสนอแนะใดๆ สามารถติดต่อได้ที่ team@wevis.info
		</div>
	</div>
</div>
<div class="bg-black px-6 py-8 text-white md:px-12 lg:px-16">
	<div class="flex flex-col gap-6 border-0 border-b border-solid border-ui-04 md:flex-row">
		<div class="min-w-[120px] flex-1">
			<img width="120px" height="34px" src="/images/logo/pw-short-white.png" alt="logo short" />
		</div>
		<div class="flex flex-row flex-wrap gap-6 pb-4 text-gray-30">
			{#each menuList as { label, icon, subs, url } (label)}
				<FooterMenuGroup title={label} menuItems={subs} {url}>
					<svelte:fragment slot="titleIcon">
						<svelte:component this={icon} class="text-inverse-link" />
					</svelte:fragment>
				</FooterMenuGroup>
			{/each}
			<FooterContact />
		</div>
	</div>

	<div class="mt-4 flex flex-col md:flex-row md:justify-between">
		<div>&copy; Parliament Watch {new Date().getFullYear()}</div>
	</div>
</div>
