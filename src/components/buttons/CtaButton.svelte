<script lang="ts">
	import { Link } from 'carbon-components-svelte';
	import { type OutboundLinkProps } from 'carbon-components-svelte/src/Link/OutboundLink.svelte';
	import { type CarbonIconProps } from 'carbon-icons-svelte';
	import type { SvelteComponent } from 'svelte';

	export let icon: typeof SvelteComponent<CarbonIconProps>;
	export let href: OutboundLinkProps['href'] = '#';
	export let external = false;
</script>

<Link
	{...$$restProps}
	{href}
	class={`btn-cta bx--btn bx--btn--primary p-[14px] font-bold text-text-04 visited:text-white hover:!text-white hover:no-underline ${$$restProps.class}`}
	{icon}
	{...external && { target: '_blank', rel: 'noopener' }}
>
	<slot />
</Link>
