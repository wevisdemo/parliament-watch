<script lang="ts">
	import { page } from '$app/stores';
	import Footer from '$components/Footer/Footer.svelte';
	import CookieConsent from '$components/Index/CookieConsent.svelte';
	import NavigationBar from '$components/NavigationBar/NavigationBar.svelte';
	import { InlineNotification } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import '../styles/index.css';
	import { DEFAULT_SEO, PROD_URL } from '$lib/seo';

	$: title = $page.data?.seo?.title ?? DEFAULT_SEO.title;
	$: description = $page.data?.seo?.description ?? DEFAULT_SEO.description;
	$: url = new URL($page.url.pathname, PROD_URL).href;
	$: og = $page.data?.seo?.og ?? DEFAULT_SEO.og;

	let isProd: undefined | boolean = undefined;

	onMount(() => {
		isProd = window.location.href.startsWith(PROD_URL);
	});

	onMount(() => {
		document.querySelectorAll('link.lazy').forEach((el) => el.setAttribute('media', 'all'));
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={og} />
	<meta property="og:url" content={url} />
	<meta property="og:description" content={description} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@wevisdemo" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={og} />
</svelte:head>

<main class="flex min-h-screen flex-col">
	<NavigationBar />
	<div class="flex-1">
		<slot />
	</div>
	<Footer />
</main>

{#if isProd !== undefined}
	{#if isProd}
		<CookieConsent />
	{:else}
		<InlineNotification
			class="fixed bottom-0 left-0 z-50 m-0 w-full min-w-0 max-w-none"
			lowContrast
			kind="warning-alt"
			title="คำเตือน:"
			subtitle="เว็บไซต์นี้อยู่ระหว่างการพัฒนา ข้อมูลทั้งหมดบนเว็บไซต์ถูกสมมุติขึ้นเป็นการชั่วคราวเท่านั้น ไม่สามารถใช้อ้างอิงได้ในทุกกรณี"
		/>
	{/if}
{/if}
