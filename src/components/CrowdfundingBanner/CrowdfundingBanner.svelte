<script lang="ts">
	import CtaButton from '$components/buttons/CtaButton.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	type BannerVariant = 'compact' | 'full';

	export let variant: BannerVariant;
	$: variantClasses = {
		container: {
			compact: 'banner-crowdfunding__container--compact',
			full: 'banner-crowdfunding__container--full'
		},
		content: {
			compact: 'banner-crowdfunding__content--compact',
			full: 'banner-crowdfunding__content--full'
		},
		description: {
			compact: 'banner-crowdfunding__desc--compact',
			full: 'banner-crowdfunding__desc--full'
		},
		contentCta: {
			compact: 'banner-crowdfunding__content-cta--compact',
			full: 'banner-crowdfunding__content-cta--full'
		},
		textCta: {
			compact: 'banner-crowdfunding__text-cta--compact',
			full: 'banner-crowdfunding__text-cta--full'
		},
		encasingCtaBtn: {
			compact: 'banner-crowdfunding__encasing-cta-btn--compact',
			full: 'banner-crowdfunding__encasing-cta-btn--full'
		}
	} satisfies Record<string, Record<BannerVariant, string>>;
</script>

<div role="banner" class="banner-crowdfunding grid">
	<aside
		class="{variantClasses.container[
			variant
		]} relative mx-auto my-auto flex w-full max-w-[1280px] justify-between px-16 py-6"
		aria-labelledby="banner-crowdfunding__heading"
	>
		{#if variant === 'full'}
			<div class="-my-11 -ml-8 w-[528px] bg-black px-[92px] py-6">
				<img
					class="banner-crowdfunding__illustration h-[175px] w-[345px]"
					src="/images/home/support-us.svg"
					alt="ร่วมซัพพอร์ต WeVis ภาคประชาชน"
				/>
			</div>
		{/if}
		<div class="{variantClasses.content[variant]} flex gap-x-4">
			{#if variant === 'compact'}
				<span class="banner-crowdfunding__emoji my-auto flex text-[46px]" aria-hidden>🥹</span>
			{/if}
			<div
				class="flex"
				class:flex-col={variant === 'full'}
				class:gap-y-6={variant === 'full'}
				class:w-full={variant === 'compact'}
				class:justify-between={variant === 'compact'}
			>
				<div class={variantClasses.textCta[variant]}>
					<h2 id="banner-crowdfunding__heading" class="banner-crowdfunding__heading font-bold">
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
				<div class="{variantClasses.encasingCtaBtn[variant]} flex">
					<CtaButton
						class="banner-crowdfunding__cta-btn visited:text-white hover:text-white"
						icon={ArrowRight}
						href="https://taejai.com/th/project/ots-parliament-watch"
						external
					>
						บริจาค
					</CtaButton>
				</div>
			</div>
		</div>
	</aside>
</div>

<style lang="postcss">
	.banner-crowdfunding {
		background-color: #a6ebd8;

		&__container {
			&--compact {
			}

			&--full {
				@apply flex gap-6 px-6 py-11;
			}
		}

		&__illustration {
			@apply h-[175px] w-[345px];
		}

		&__heading {
			@apply font-['Kondolar_Thai'] text-[28px] leading-9;
		}

		&__content {
			&--compact {
				@apply w-full;
			}

			&--full {
			}
		}

		&__text-cta {
			&--compact {
				/* @apply gap-x-4; */
			}

			&--full {
				/* @apply gap-y-4; */
			}
		}

		&__desc {
			&--compact {
				@apply text-[16px] font-bold leading-[22px];
			}

			&--full {
				@apply text-[14px] font-normal leading-[20px];
			}
		}

		&__emoji {
		}

		&__cta-btn {
			&::after {
				@apply absolute inset-0 content-[''];
			}
		}

		&__encasing-cta-btn {
			&--compact {
				@apply my-auto h-fit;
			}

			&--full {
				@apply justify-end;
			}
		}
	}
</style>
