<script lang="ts">
	import '@wevisdemo/ui/styles/cookie-consent.css';
	import WvCookieConsent, {
		type CookieConsentProps
	} from '@wevisdemo/ui/svelte/cookie-consent.svelte';
	import { initClarity } from '$lib/clarity';

	const onAccept: CookieConsentProps['onAccept'] = (option) => {
		if (option['Performance']) {
			initClarity();
		}
	};
</script>

<WvCookieConsent
	policyUrl="https://wevis.info/cookies_1-3/"
	cookieOptions={['Performance']}
	{onAccept}
/>
