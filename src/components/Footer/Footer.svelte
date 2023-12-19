<script lang="ts">
	import WeVisText from '$components/icons/WeVisText.svelte';
	import { ArrowUpRight } from 'carbon-icons-svelte';
	import FooterContact from './FooterContact.svelte';
	import FooterMenuGroup from './FooterMenuGroup.svelte';
	import { menuList } from '$components/NavigationBar/NavigationBar.svelte';

	menuList;
</script>

<div class="grid grid-cols-1 gap-4 bg-white py-8 px-6 md:px-12 lg:px-16 text-sm">
	<div>
		เว็บไซต์นี้สร้างโดย<br />
		<a href="https://wevis.info/">
			<div class="flex flex-row items-end mb-2">
				<WeVisText width="79px" height="24px" viewBox="0 0 79 24" class="text-black" />
				<ArrowUpRight class="text-black ml-2" size={16} />
			</div>
		</a>
		<span>ซึ่งเป็น… เริ่มสร้างเว็บไซต์นี้โดยมีจุดประสงค์เพื่อ… และได้รับการสนับสนุนจาก….</span>
	</div>
	<div>
		<div class="font-semibold">ความถูกต้องและการอ้างอิงข้อมูลในเว็บไซต์</div>
		<div>
			(พารากราฟสั้นๆ อธิบายประเด็นต่อไปนี้) ข้อมูลในเว็บไซต์นี้เรารวบรวมจาก…
			โดยได้รวบรวมและอัปเดทข้อมูลเมื่อ(หรือทุกๆ)…ข้อมูลอาจมีความคลาดเคลื่อน
			ซึ่งเป็นไปได้ว่าเกิดจาก…หากคุณต้องการนำข้อมูลไปใช้ในงานของคุณเราแนะนำให้คุณ….หรือหากมีข้อสงสัยว่าข้อมูลไม่ถูกต้อง
			กรุณาติดต่อ …. WeVis ซึ่งเป็น… เริ่มสร้างเว็บไซต์นี้โดยมีจุดประสงค์เพื่อ…
			และได้รับการสนันบสนุนจาก….
		</div>
	</div>
	<div>
		<div class="font-semibold">Open Source License</div>
		<div>
			(not final content) This website and its projects are open source. You're free to use, modify,
			and share everything here. Attribution is appreciated but not required. Details in the
			project-specific licenses. Link
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
		<FooterContact />
	</div>
	<div class="flex flex-col md:flex-row md:justify-between mt-4">
		<div>&copy; Parliament Watch 2023</div>
		<div class="text-gray-30">นโยบายความปลอดภัย | Privacy Policy</div>
	</div>
</div>
