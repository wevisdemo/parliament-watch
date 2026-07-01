<script lang="ts">
	import { SideNav, SideNavItems, SideNavLink } from 'carbon-components-svelte';

	interface Props {
		class?: string;
		currentNavElementId: string;
		sections: {
			menu: string;
			menuItem: { text: string }[];
		}[];
	}

	let { class: className = '', currentNavElementId, sections }: Props = $props();
</script>

<SideNav isOpen fixed class="relative z-0 {className}">
	<SideNavItems>
		{#each sections as section (section.menu)}
			<SideNavLink
				href="#{section.menu.replaceAll(' ', '-')}"
				isSelected={currentNavElementId === section.menu.replaceAll(' ', '-')}
				>{section.menu}</SideNavLink
			>
			{#each section.menuItem as item (item.text)}
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
