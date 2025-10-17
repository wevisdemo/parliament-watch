<script lang="ts">
	import CtaButton from '$components/buttons/CtaButton.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	type BannerVariant = 'compact' | 'full';

	// eslint-disable-next-line svelte/valid-compile
	export let variant: BannerVariant;
</script>

<div role="banner" class="banner-crowdfunding grid">
	<aside
		class="relative mx-auto my-auto flex w-full max-w-[1280px] justify-between px-16 py-6"
		aria-labelledby="crowdfunding-heading"
	>
		<div class="flex gap-x-4">
			{#if variant == 'compact'}
				<span class="banner-crowdfunding--emoji my-auto flex text-[46px]" aria-hidden>🥹</span>
			{/if}
			<div>
				<h2 id="crowdfunding-heading" class="banner-crowdfunding__heading font-bold">
					ร่วมสนับสนุนเว็บไซต์นี้
				</h2>
				<p class="banner-crowdfunding__desc font-bold">
					การสนับสนุนของคุณ คือส่วนสำคัญให้เครื่องมือติดตามการทำงานของผู้แทนนี้ ถูกพัฒนาต่อไป
				</p>
			</div>
		</div>
		<span class="banner-crowdfunding__cta--btn-wrapper my-auto flex">
			<CtaButton
				class="banner-crowdfunding__cta--btn visited:text-white hover:text-white"
				icon={ArrowRight}
				href="https://taejai.com/th/project/ots-parliament-watch"
				external
			>
				บริจาค
			</CtaButton>
		</span>
	</aside>
</div>

<style lang="postcss">
	.banner-crowdfunding {
		background-color: #a6ebd8;

		&__heading {
			font-family: 'Kondolar Thai';
			font-size: 28px;
			line-height: 36px;
		}

		&__desc {
			font-size: 16px;
			line-height: 22px;
		}

		&--emoji,
		&__cta {
			&--btn-wrapper {
				height: fit-content;
			}
		}
	}
</style>
