<script lang="ts">
	import type { Party } from '$models/party';

	export let id: number;
	export let firstname: string;
	export let lastname: string;
	export let avatar: string;
	export let party: Party;
	export let role: string;
	export let isLarge = false;

	$: fullname = `${firstname} ${lastname}`;

	$: imgSize = isLarge ? 64 : 40;
	$: imgClass = isLarge ? 'w-[64px] h-[64px]' : 'w-[40px] h-[40px]';
	$: titleClass = isLarge
		? 'text-lg leading-[28px] font-bold font-serif'
		: 'text-sm leading-[18px] underline mb-1';
	$: subtitleClass = isLarge ? 'leading-[18px]' : 'text-xs leading-[16px]';
</script>

<div {id} class="p-2 font-sans flex gap-4">
	<div class="{imgClass} relative">
		<img
			src={avatar}
			alt={fullname}
			class="w-full h-full rounded-full object-cover"
			width={imgSize}
			height={imgSize}
			loading="lazy"
			decoding="async"
		/>
		<div
			class="w-[16px] h-[16px] absolute bottom-0 right-0 rounded-full border-solid border border-[#C0BFBE] bg-white overflow-hidden p-[2px] flex items-center justify-center"
		>
			<img
				class="w-full h-full object-contain"
				src={party.logo}
				alt={party.name}
				width="16"
				height="16"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
	<div>
		<p class="text-text-01 {titleClass}">{fullname}</p>
		<p class="text-text-02 {subtitleClass}">พรรค{party.name}</p>
		<p class="text-text-02 {subtitleClass}">{role}</p>
	</div>
</div>
