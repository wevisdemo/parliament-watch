<script lang="ts">
	import { SideNav, SideNavItems, SideNavMenu, SideNavMenuItem } from 'carbon-components-svelte';

	const sections = [
		{
			menu: 'แนะนำภาพรวม',
			menuItem: [
				{ text: 'การออกกฎหมายตามรัฐธรรมนูญ 2560' },
				{ text: 'กฎหมายบังคับใช้ได้อย่างไร' },
				{ text: 'กฎหมายในเว็บไซต์นี้' },
				{ text: 'ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา' },
				{ text: 'สถานะของกฎหมาย' }
			]
		},
		{
			menu: 'ขั้นตอนการออกกฎหมายโดยรัฐสภา',
			menuItem: [{ text: 'ขั้นตอนทั่วไป' }, { text: 'ขั้นตอนพิเศษของกฎหมายบางประเภท' }]
		},
		{
			menu: 'เข้าใจการลงมติของ สส. และ สว.',
			menuItem: [
				{ text: 'การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง ?' },
				{ text: 'วิธีการลงมติ' },
				{ text: 'ประเภทการลงมติ' },
				{ text: 'ผลการลงมติ' }
			]
		},
		{
			menu: 'เข้าใจการลงมติของ สส. และ สว.',
			menuItem: [
				{ text: 'หน้าที่ของสมาชิกสภาผู้แทนราษฏร (สส.)' },
				{ text: 'หน้าที่ของสมาชิกวุฒิสภา (สว.)' },
				{ text: 'หน้าที่ของสภาร่วม (ส.ส. + ส.ว.)' }
			]
		}
	];
</script>

<SideNav isOpen fixed class="relative z-0">
	<SideNavItems>
		{#each sections as section}
			<SideNavMenu text={section.menu} expanded class="font-bold text-black">
				{#each section.menuItem as item}
					<SideNavMenuItem href="#{item.text}">{item.text}</SideNavMenuItem>
				{/each}
			</SideNavMenu>
		{/each}
	</SideNavItems>
</SideNav>
