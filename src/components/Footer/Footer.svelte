<script lang="ts">
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';
	import type { Link } from '$models/link';
	import { ArrowUpRight } from 'carbon-icons-svelte';
	import FooterContact from './FooterContact.svelte';
	import FooterMenuGroup from './FooterMenuGroup.svelte';
	import pwLogo from '/static/images/logo/pw-short-white.png';
	import wevisLogo from '/static/images/logo/wevis-full-black.png';

	const representativeMenu: Link[] = [
		{
			label: 'สภาผู้แทนราษฎร',
			url: '/'
		},
		{
			label: 'วุฒิสภา',
			url: '/'
		}
	];

	const legistrationMenu: Link[] = [
		{
			label: 'กฎหมายในกระบวนการ',
			url: '/'
		},
		{
			label: 'รัฐออกกฎหมายอย่างไร',
			url: '/'
		}
	];

	const aboutUsMenu: Link[] = [
		{
			label: 'ที่มาของโครงการ',
			url: '/'
		},
		{
			label: 'ข้อมูลในเว็บนี้',
			url: '/'
		},
		{
			label: 'เกี่ยวกับ WeVis',
			url: '/'
		}
	];
</script>

<div class="grid grid-cols-1 gap-4 bg-white py-8 px-16 text-sm">
	<div>
		เว็บไซต์นี้สร้างโดย<br />
		<a href="https://wevis.info/">
			<div class="flex flex-row items-end">
				<img width="79px" height="24px" src={wevisLogo} alt="wevis-logo" />
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
<div class="bg-black py-8 px-16 text-white">
	<div
		class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4 pb-4 border-solid border-0 border-b border-ui-04 text-gray-30"
	>
		<div class="row-span-2">
			<img width="120px" height="34px" src={pwLogo} alt="logo short" />
		</div>
		<FooterMenuGroup title="สมาชิกรัฐสภา" menuItems={representativeMenu}>
			<svelte:fragment slot="titleIcon">
				<PoliticianIcon class="text-inverse-link" />
			</svelte:fragment>
		</FooterMenuGroup>
		<FooterMenuGroup title="สมาชิกรัฐสภา" menuItems={legistrationMenu}>
			<svelte:fragment slot="titleIcon">
				<LawIcon class="text-inverse-link" />
			</svelte:fragment>
		</FooterMenuGroup>
		<FooterMenuGroup title="การลงมติ" url="/">
			<svelte:fragment slot="titleIcon">
				<VoteIcon class="text-inverse-link" />
			</svelte:fragment>
		</FooterMenuGroup>
		<FooterMenuGroup title="เกี่ยวกับเรา" menuItems={aboutUsMenu}>
			<svelte:fragment slot="titleIcon">
				<WeVisIcon class="text-white" />
			</svelte:fragment>
		</FooterMenuGroup>
		<FooterContact />
	</div>
	<div class="flex flex-col md:flex-row md:justify-between mt-4">
		<div>©Parliament Watch 2023</div>
		<div class="text-gray-30">นโยบายความปลอดภัย | Privacy Policy</div>
	</div>
</div>
