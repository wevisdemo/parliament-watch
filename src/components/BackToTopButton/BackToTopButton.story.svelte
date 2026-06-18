<script lang="ts">
	import BackToTopButton from './BackToTopButton.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;
</script>

<Hst.Story title="BackToTopButton">
	<BackToTopButton
		size={40}
		padding={12}
		border={1}
		borderRadius={2}
		color=""
		bgColor=""
		margin={20}
		showAt={50}
	/>
	<pre style="background-color: rgba(0, 0, 0, 0.1);">
		P
		l
		e
		a
		s
		e

		.

		s
		c
		r
		o
		l
		l

		.

		d
		o
		w
		n

		.

		t
		o

		.

		l
		e
		t

		.

		t
		h
		e

		.

		'BackToTopButton'
		Component

		.

		s
		h
		o
		w
		n

		.
		.
		.

		Not yet?

		.
		.
		.

		.
		.
		.

		.
		.
		.

		.
		.
		.

		Have you reached there?!?

		.
		.
		.

		.
		.
		.

		A little bit more ...

		.
		.
		.

		.
		.
		.
		
		.
		.
		.

		Wholaaaa! Click on the button to see the magic!
	</pre>
</Hst.Story>
