<script lang="ts">
	import githubLogo from '/static/images/logo/github.png';
	import faceBookLogo from '/static/images/logo/facebook.png';
	import instagramLogo from '/static/images/logo/instagram.png';
	import xLogo from '/static/images/logo/x.png';
	import Email from 'carbon-icons-svelte/lib/Email.svelte';
</script>

<div class="flex flex-col">
	<div class="text-sm mb-3">
		<div class="mb-2">ติดต่อ</div>
		<a href="mailto:info@punchup.world" class="text-gray-30 hover:text-white no-underline">
			<div class="flex flex-row items-center">
				<Email size={16} />
				<span class="ml-2">info@punchup.world</span>
			</div>
		</a>
	</div>
	<div class="text-sm">
		<div class="mb-2">ติดตาม</div>
		<div class="flex flex-row">
			<div class="mr-3">
				<a href="https://github.com/wevisdemo/parliament-watch">
					<img src={githubLogo} alt="github-logo" />
				</a>
			</div>
			<div class="mr-3">
				<a href="https://www.facebook.com/wevisdemo">
					<img src={faceBookLogo} alt="facebook-logo" />
				</a>
			</div>
			<div class="mr-3">
				<a href="https://github.com/wevisdemo/parliament-watch">
					<img src={instagramLogo} alt="instagram-logo" />
				</a>
			</div>
			<div class="mr-3">
				<a href="https://twitter.com/wevisdemo">
					<img src={xLogo} alt="x-logo" />
				</a>
			</div>
		</div>
	</div>
</div>
