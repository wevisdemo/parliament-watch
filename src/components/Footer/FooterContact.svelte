<script lang="ts">
	import Email from 'carbon-icons-svelte/lib/Email.svelte';
	import GithubIcon from '$components/icons/GithubIcon.svelte';
	import FacebookIcon from '$components/icons/FacebookIcon.svelte';
	import InstagramIcon from '$components/icons/InstagramIcon.svelte';
	import XIcon from '$components/icons/XIcon.svelte';
</script>

<div class="flex flex-col">
	<div class="mb-3 text-sm">
		<div class="mb-2">ติดต่อ</div>
		<a href="mailto:team@wevis.info" class="text-gray-30 no-underline hover:text-white">
			<div class="flex w-min flex-row items-center">
				<Email size={16} />
				<span class="ml-2">team@wevis.info</span>
			</div>
		</a>
	</div>
	<div class="text-sm">
		<div class="mb-2">ติดตาม</div>
		<div class="flex flex-row">
			<div class="mr-3">
				<a
					href="https://github.com/wevisdemo/parliament-watch"
					class="text-gray-30 hover:text-gray-10"
				>
					<GithubIcon size={32} />
				</a>
			</div>
			<div class="mr-3">
				<a href="https://www.facebook.com/wevisdemo" class="text-gray-30 hover:text-gray-10">
					<FacebookIcon size={32} />
				</a>
			</div>
			<div class="mr-3">
				<a
					href="https://github.com/wevisdemo/parliament-watch"
					class="text-gray-30 hover:text-gray-10"
				>
					<InstagramIcon size={32} />
				</a>
			</div>
			<div class="mr-3">
				<a href="https://twitter.com/wevisdemo" class="text-gray-30 hover:text-gray-10">
					<XIcon size={32} />
				</a>
			</div>
		</div>
	</div>
</div>
