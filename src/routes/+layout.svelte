<script>
	import '../styles/index.css';
	import NavigationBar from '$components/NavigationBar/NavigationBar.svelte';
	import { InlineNotification } from 'carbon-components-svelte';
	import Footer from '$components/Footer/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	$: title =
		$page.data?.seo?.title ??
		'Parliament Watch - ขับเคลื่อนประชาธิปไตย ร่วมเฝ้าดูความเคลื่อนไหวรัฐสภา';
	$: description = $page.data?.seo?.description ?? 'ติดตามกฎหมาย นโยบาย และการทำงานของนักการเมือง';
	$: url = new URL($page.route.id ?? '/', 'https://parliamentwatch.wevis.info/').href;
	$: og = $page.data?.seo?.og ?? 'https://parliamentwatch.wevis.info/images/og.png';

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

<main class="min-h-screen flex flex-col">
	<NavigationBar />
	<div class="flex-1">
		<slot />
	</div>
	<Footer />
</main>

<InlineNotification
	class="fixed z-50 w-full left-0 bottom-0 m-0 max-w-none min-w-0"
	lowContrast
	kind="warning-alt"
	title="คำเตือน:"
	subtitle="เว็บไซต์นี้อยู่ระหว่างการพัฒนา ข้อมูลทั้งหมดบนเว็บไซต์ถูกสมมุติขึ้นเป็นการชั่วคราวเท่านั้น ไม่สามารถใช้อ้างอิงได้ในทุกกรณี"
/>
