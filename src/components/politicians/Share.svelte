<script lang="ts">
	import Link from 'carbon-icons-svelte/lib/Link.svelte';
	import { onMount } from 'svelte';

	export let url = '';

	$: encodedURL = encodeURIComponent(url);

	const copyUrl = () => {
		window.navigator.clipboard.writeText(url);
	};

	onMount(() => {
		url ||= window.location.href;
	});
</script>

<div class="flex gap-2 items-center">
	<strong class="heading-01">แชร์ประวัติ</strong>
	<button
		class="flex items-center justify-center border border-solid border-black rounded-full bg-black/0 w-[28px] h-[28px] text-black cursor-pointer hover:bg-black hover:text-white transition-colors ease-[cubic-bezier(0.2,0.2,0.38,0.9)] duration-[110ms]"
		type="button"
		on:click={copyUrl}
	>
		<Link />
	</button>
	<a
		class="flex items-center justify-center border border-solid border-black rounded-full bg-black/0 w-[28px] h-[28px] text-black cursor-pointer hover:bg-black hover:text-white transition-colors ease-[cubic-bezier(0.2,0.2,0.38,0.9)] duration-[110ms]"
		href={'http://www.facebook.com/sharer/sharer.php?u=' + encodedURL}
		target="_blank"
		rel="nofollow noopener noreferrer"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 18" width="8" height="18"
			><path
				fill="currentColor"
				fill-rule="evenodd"
				d="M1.81 13.225c0-1.31-.008-2.62.007-3.93 0-.221-.06-.288-.281-.28-.407.015-.814 0-1.228.007-.163.008-.23-.044-.222-.214.007-.814.007-1.636 0-2.45 0-.155.044-.207.207-.207.414.008.836-.015 1.25.008.245.014.289-.074.289-.296a39.162 39.162 0 010-1.865c.015-.762.222-1.473.673-2.087C3.075 1.127 3.89.771 4.83.727 5.79.683 6.76.705 7.729.697c.134 0 .178.045.178.178-.007.829-.007 1.658 0 2.48 0 .147-.044.191-.192.191a43.588 43.588 0 00-1.392 0c-.621 0-.991.319-1.028.933-.03.488-.007.984-.022 1.48-.008.177.103.163.214.163.703 0 1.414.007 2.117-.008.207 0 .273.045.251.26-.089.82-.163 1.642-.237 2.47-.014.186-.103.223-.266.223a62.99 62.99 0 00-1.672 0c-.4 0-.363-.06-.363.347 0 2.568-.007 5.128.007 7.696 0 .274-.066.34-.332.333a92.83 92.83 0 00-2.872 0c-.266.007-.31-.089-.31-.326v-3.892z"
				clip-rule="evenodd"
			/></svg
		>
	</a>
	<a
		class="flex items-center justify-center border border-solid border-black rounded-full bg-black/0 w-[28px] h-[28px] text-black cursor-pointer hover:bg-black hover:text-white transition-colors ease-[cubic-bezier(0.2,0.2,0.38,0.9)] duration-[110ms]"
		href={'https://twitter.com/intent/tweet?url=' + encodedURL}
		target="_blank"
		rel="nofollow noopener noreferrer"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 15" width="16" height="15"
			><path
				fill="currentColor"
				d="M.039 0l6.177 7.844L0 14.222h1.4l5.442-5.584 4.397 5.584H16L9.475 5.937 15.26 0h-1.4L8.85 5.143 4.8 0H.039zm2.057.979h2.188l9.658 12.264h-2.187L2.096.98z"
			/></svg
		>
	</a>
</div>
