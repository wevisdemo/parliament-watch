<script lang="ts">
	import WeVisText from '$components/icons/WeVisText.svelte';
	import { ArrowUpRight } from 'carbon-icons-svelte';
	import FooterContact from './FooterContact.svelte';
	import FooterMenuGroup from './FooterMenuGroup.svelte';
	import { menuList } from '$components/NavigationBar/NavigationBar.svelte';

	menuList;
</script>

<div class="flex flex-col items-center gap-4 bg-white py-8 px-6 md:px-12 lg:px-16 text-sm">
	<p class="max-w-[1200px]">
		เว็บไซต์นี้สร้างโดย
		<a
			href="https://wevis.info/"
			target="_blank"
			rel="nofollow noopener noreferrer"
			class="flex flex-row items-end mb-2"
		>
			<WeVisText width="79px" height="24px" viewBox="0 0 79 24" class="text-black" />
			<ArrowUpRight class="text-black ml-2" size={16} />
		</a>
		กลุ่มเทคโนโลยีภาคประชาชน (Civic Technology) ที่ขับเคลื่อนสังคมผ่านเทคโนโลยีและข้อมูลเปิด (Open Data)
		ภารกิจของเราคือการทำให้ประชาธิปไตยไทยเปิดเผย โปรงใส และมีส่วนรวมได้ เราจึงตั้งใจพัฒนาโปรเจกต์ Parliament
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
			> หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง
			หรือมีข้อเสนอแนะใดๆ สามารถติดต่อได้ที่ team@punchup.world
		</div>
	</div>
</div>
<div class="bg-black py-8 px-6 md:px-12 lg:px-16 text-white">
	<div
		class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 md:gap-y-4 lg:gap-x-6 gap-y-4 pb-4 border-solid border-0 border-b border-ui-04 text-gray-30"
	>
		<div class="row-span-2">
			<img width="120px" height="34px" src="/images/logo/pw-short-white.png" alt="logo short" />
		</div>
		{#each menuList as { label, icon, subs, url }}
			<FooterMenuGroup title={label} menuItems={subs} {url}>
				<svelte:fragment slot="titleIcon">
					<svelte:component this={icon} class="text-inverse-link" />
				</svelte:fragment>
			</FooterMenuGroup>
		{/each}
		<!-- NOTE - This is for justifying the contact in LG size.
		When the nav links are back to normal, these should be removed -->
		<div class="hidden lg:block" />
		<div class="hidden lg:block" />
		<FooterContact />
	</div>
	<div class="flex flex-col md:flex-row md:justify-between mt-4">
		<div>&copy; Parliament Watch 2023</div>
		<!-- <div class="text-gray-30">นโยบายความปลอดภัย | Privacy Policy</div> -->
	</div>
</div>
