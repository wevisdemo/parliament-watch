<script lang="ts">
	import { SideNav, SideNavItems, SideNavMenu, SideNavMenuItem } from 'carbon-components-svelte';

	const sections = [
		{
			menu: 'แนะนำภาพรวม',
			menuItem: [
				{ text: 'กฎหมายสำเร็จได้อย่างไร' },
				{ text: 'กฎหมายในเว็บไซต์นี้' },
				{ text: 'ประเภทของกฎหมาย' },
				{ text: 'สถานะของกฎหมาย' }
			]
		},
		{
			menu: 'ขั้นตอนของกฎหมาย',
			menuItem: [
				{ text: 'ที่มาของกฎหมาย' },
				{ text: 'ขั้นตอนโดยย่อ' },
				{ text: 'ขั้นตอนโดยละเอียด' }
			]
		},
		{
			menu: 'ประเภทการลงมติ',
			menuItem: [{ text: 'ประเภทของมติ' }, { text: 'ผลของการลงมติ' }, { text: 'การลงมติอื่นๆ' }]
		},
		{
			menu: 'ส.ส. และ ส.ว. ทำอะไรบ้างในสภา',
			menuItem: [
				{ text: 'หน้าที่ของ ส.ส.' },
				{ text: 'หน้าที่ของ ส.ว.' },
				{ text: 'หน้าที่ของสภาร่วม (ส.ส. + ส.ว.)' }
			]
		}
	];
</script>

<SideNav isOpen={true} fixed={false} class="relative z-0">
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
