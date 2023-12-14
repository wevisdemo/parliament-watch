<script lang="ts">
	import { SideNav, SideNavItems, SideNavLink } from 'carbon-components-svelte';

	export let currentNavElementId: string;
	export let sections: {
		menu: string;
		menuItem: { text: string }[];
	}[];
</script>

<SideNav isOpen fixed class="relative z-0">
	<SideNavItems>
		{#each sections as section}
			<SideNavLink href="#{section.menu}" isSelected={currentNavElementId === section.menu}
				>{section.menu}</SideNavLink
			>
			{#each section.menuItem as item}
				<SideNavLink
					class="!pl-8"
					href="#{item.text}"
					isSelected={currentNavElementId === item.text}>{item.text}</SideNavLink
				>
			{/each}
		{/each}
	</SideNavItems>
</SideNav>
