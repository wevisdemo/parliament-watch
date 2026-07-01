<script lang="ts">
	import { Link } from 'carbon-components-svelte';
	import type { CarbonIconProps } from 'carbon-icons-svelte';
	import type { Component } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		icon?: Component<CarbonIconProps> | undefined;
		href?: string;
		external?: boolean;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { icon = undefined, href = '#', external = false, children, ...rest }: Props = $props();
</script>

<Link
	{...rest}
	class="btn-cta bx--btn bx--btn--primary p-[14px] font-bold text-text-04 visited:text-white hover:!text-white hover:no-underline {rest.class}"
	{href}
	{icon}
	{...external && { target: '_blank', rel: 'nofollow noopener noreferrer' }}
>
	{@render children?.()}
</Link>
