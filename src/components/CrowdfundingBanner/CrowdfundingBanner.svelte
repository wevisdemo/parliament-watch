<script lang="ts">
	import CtaButton from '$components/buttons/CtaButton.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	type BannerVariant = 'compact' | 'full';

	export let variant: BannerVariant;
	$: variantClasses = {
		root: {
			compact: compactVariantBemClasses('root'),
			full: fullVariantBemClasses('root')
		},
		contentGroup: {
			compact: compactVariantBemClasses('content-group'),
			full: fullVariantBemClasses('content-group')
		},
		content: {
			compact: compactVariantBemClasses('content'),
			full: fullVariantBemClasses('content')
		},
		description: {
			compact: compactVariantBemClasses('description'),
			full: fullVariantBemClasses('description')
		},
		contentCta: {
			compact: compactVariantBemClasses('content-cta'),
			full: fullVariantBemClasses('content-cta')
		},
		textContent: {
			compact: compactVariantBemClasses('text-content--compact'),
			full: fullVariantBemClasses('text-content--compact')
		},
		ctaWrapper: {
			compact: compactVariantBemClasses('cta-wrapper'),
			full: fullVariantBemClasses('cta-wrapper')
		}
	} satisfies Record<string, Record<BannerVariant, string>>;

	function compactVariantBemClasses(element: string) {
		return buildBemClasses(element, 'compact');
	}

	function fullVariantBemClasses(element: string) {
		return buildBemClasses(element, 'full');
	}

	function buildBemClasses(element: string, modifier: string): string {
		const block = 'banner-crowdfunding';
		const blockElement = `${block}__${element}`;

		return [blockElement, `${blockElement}--${modifier}`].join(' ');
	}
</script>

<div role="banner" class="banner-crowdfunding grid">
	<aside class={variantClasses.root[variant]} aria-labelledby="banner-crowdfunding__heading">
		{#if variant === 'full'}
			<div class="-mx-8 -my-11 flex w-[528px] bg-black px-0 py-0 lg:px-[92px] lg:py-6">
				<img
					class="banner-crowdfunding__illustration m-auto h-[175px] w-[345px]"
					src="/images/home/support-us.svg"
					alt="ร่วมซัพพอร์ต WeVis ภาคประชาชน"
				/>
			</div>
		{/if}
		<div class="{variantClasses.content[variant]} flex gap-x-4 pl-6">
			{#if variant === 'compact'}
				<span class="banner-crowdfunding__emoji my-auto flex text-[46px]" aria-hidden>🥹</span>
			{/if}
			<div class={variantClasses.contentGroup[variant]}>
				<div class={variantClasses.textContent[variant]}>
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
				<div class="{variantClasses.ctaWrapper[variant]} flex">
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

		&__root {
			@apply relative mx-auto my-auto flex w-full max-w-[1280px] justify-between px-16 py-6;

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

		&__content-group {
			@apply flex;

			&--compact {
				@apply w-full justify-between;
			}

			&--full {
				@apply flex-col gap-y-6;
			}
		}

		&__content {
			&--compact {
				@apply w-full;
			}

			&--full {
			}
		}

		&__text-content {
			&--compact {
				/* @apply gap-x-4; */
			}

			&--full {
				/* @apply gap-y-4; */
			}
		}

		&__description {
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

		&__cta-wrapper {
			&--compact {
				@apply my-auto h-fit;
			}

			&--full {
				@apply justify-end;
			}
		}
	}
</style>
