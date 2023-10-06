<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BackToTopButton from './BackToTopButton.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="BackToTopButton">
	<BackToTopButton
		size="40px"
		padding="12px"
		border="1px"
		borderRadius="2px"
		margin="20px"
		showAt={50}
	/>
	<pre>
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
