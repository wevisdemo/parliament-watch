<script lang="ts">
	import { SideNav, SideNavItems, SideNavLink } from 'carbon-components-svelte';

	let className = '';
	export { className as class };

	export let currentNavElementId: string;
	export let sections: {
		menu: string;
		menuItem: { text: string }[];
	}[];
</script>

<SideNav isOpen fixed class="relative z-0 {className}">
	<SideNavItems>
		{#each sections as section}
			<SideNavLink
				href="#{section.menu.replaceAll(' ', '-')}"
				isSelected={currentNavElementId === section.menu.replaceAll(' ', '-')}
				>{section.menu}</SideNavLink
			>
			{#each section.menuItem as item}
				<SideNavLink
					class="!pl-8 !font-normal"
					href="#{item.text.replaceAll(' ', '-')}"
					isSelected={currentNavElementId === item.text.replaceAll(' ', '-')}
					>{item.text}</SideNavLink
				>
			{/each}
		{/each}
	</SideNavItems>
</SideNav>
