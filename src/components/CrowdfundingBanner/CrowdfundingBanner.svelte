<script lang="ts">
	import CtaButton from '$components/buttons/CtaButton.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	type BannerVariant = 'compact' | 'full';

	// eslint-disable-next-line svelte/valid-compile
	export let variant: BannerVariant;
	$: variantClasses = {
		container: {
			compact: 'banner-crowdfunding__container--compact',
			full: 'banner-crowdfunding__container--full'
		},
		description: {
			compact: 'banner-crowdfunding__desc--compact',
			full: 'banner-crowdfunding__desc--full'
		}
	} satisfies Record<string, Record<BannerVariant, string>>;
</script>

<div role="banner" class="banner-crowdfunding grid">
	<aside
		class="{variantClasses.container[
			variant
		]} relative mx-auto my-auto flex w-full max-w-[1280px] justify-between px-16 py-6"
		aria-labelledby="crowdfunding-heading"
	>
		{#if variant === 'full'}
			<div class="-my-6 -ml-8 bg-black px-[96px] py-6">
				<img
					class="banner-crowdfunding__illustration h-[175px] w-[345px]"
					src="/images/home/support-us.svg"
					alt=""
				/>
			</div>
		{/if}
		<div class="banner-crowdfunding__content flex gap-x-4">
			{#if variant === 'compact'}
				<span class="banner-crowdfunding--emoji my-auto flex text-[46px]" aria-hidden>🥹</span>
			{/if}
			<div>
				<h2 id="crowdfunding-heading" class="banner-crowdfunding__heading font-bold">
					ร่วมสนับสนุนเว็บไซต์นี้
				</h2>
				<p class={variantClasses.description[variant]} class:font-bold={variant === 'compact'}>
					{#if variant === 'compact'}
						การสนับสนุนของคุณ คือส่วนสำคัญให้เครื่องมือติดตามการทำงานของผู้แทนนี้ ถูกพัฒนาต่อไป
					{/if}
					{#if variant === 'full'}
						ทุกการสนับสนุนของคุณ คือส่วนสำคัญให้ WeVis
						<br />
						สามารถพัฒนาเครื่องมือสำหรับให้ประชาชนติดตามและตั้งคำถามต่อการทำงานของผู้แทนได้ต่อไป
					{/if}
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

		&__container {
			&--compact {
			}

			&--full {
				@apply flex gap-6 px-6 py-8;
			}
		}

		&__illustration {
			height: 175px;
			width: 345px;
		}

		&__heading {
			font-family: 'Kondolar Thai';
			font-size: 28px;
			line-height: 36px;
		}

		&__desc {
			&--compact {
				font-size: 16px;
				line-height: 22px;
			}
			&--full {
				font-size: 14px;
				line-height: 20px;
			}
		}

		&--emoji,
		&__cta {
			&--btn-wrapper {
				height: fit-content;
			}

			&--btn::after {
				inset: 0;
				position: absolute;
				content: '';
			}
		}
	}
</style>
