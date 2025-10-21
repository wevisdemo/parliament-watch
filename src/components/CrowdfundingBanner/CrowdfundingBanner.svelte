<script lang="ts">
	import CtaButton from '$components/buttons/CtaButton.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	type BannerVariant = 'compact' | 'full';

	export let variant: BannerVariant;
	const variantClasses = {
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
			compact: compactVariantBemClasses('text-content'),
			full: fullVariantBemClasses('text-content')
		},
		ctaWrapper: {
			compact: compactVariantBemClasses('cta-wrapper'),
			full: fullVariantBemClasses('cta-wrapper')
		}
	} as const satisfies Record<string, Record<BannerVariant, string>>;

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

<div role="banner" class="banner-crowdfunding">
	<aside class={variantClasses.root[variant]} aria-labelledby="banner-crowdfunding__heading">
		{#if variant === 'full'}
			<div class="flex bg-black p-0 md:max-w-[528px] lg:px-[92px] lg:py-6">
				<img
					class="banner-crowdfunding__illustration"
					src="/images/home/support-us.jpg"
					alt="ร่วมซัพพอร์ต WeVis ภาคประชาชน"
				/>
			</div>
		{/if}
		<div class={variantClasses.content[variant]}>
			{#if variant === 'compact'}
				<span class="banner-crowdfunding__emoji" aria-hidden>🥹</span>
			{/if}
			<div class={variantClasses.contentGroup[variant]}>
				<div class={variantClasses.textContent[variant]}>
					<h2 id="banner-crowdfunding__heading" class="banner-crowdfunding__heading">
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
				<div class={variantClasses.ctaWrapper[variant]}>
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
		@apply bg-[#A6EBD8];

		&__root {
			@apply relative m-auto flex w-full max-w-[1280px] justify-center;

			&--compact {
				@apply p-4 md:px-16 md:py-6;
			}

			&--full {
				@apply flex flex-col md:flex-row;
			}
		}

		&__illustration {
			@apply m-auto max-w-[345px];
		}

		&__heading {
			@apply font-['Kondolar_Thai'] text-[28px] font-bold leading-9;
		}

		&__content-group {
			@apply flex flex-col gap-4;

			&--compact {
				@apply w-full justify-between md:flex-row;
			}

			&--full {
				@apply md:gap-6;
			}
		}

		&__content {
			@apply flex gap-x-4;

			&--compact {
				@apply w-full md:items-center;
			}

			&--full {
				@apply my-auto flex-col p-4 md:p-6;
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
			@apply flex text-[46px];
		}

		&__cta-wrapper {
			@apply flex justify-end;

			&--compact {
				@apply my-auto h-fit;
			}
		}
	}
</style>
