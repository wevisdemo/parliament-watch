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
</script>

{#if isLarge}
	<div class="p-2">
		<div class="flex gap-4">
			<div class="w-[64px] h-[64px] relative">
				<img
					src={avatar}
					alt={`${fullname}-${id}`}
					class="w-full h-full rounded-full object-cover"
					width="64"
					height="64"
					loading="lazy"
					decoding="async"
				/>
				<div
					class="w-[16px] h-[16px] flex items-center justify-center overflow-hidden absolute bottom-0 right-0 rounded-full border-solid border bg-white border-[#C0BFBE]"
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
				<p class="text-lg leading-6 text-text-01 font-bold">{fullname}</p>
				<p class="leading-4 text-text-02">พรรค{party.name}</p>
				<p class="leading-4 text-text-02">{role}</p>
			</div>
		</div>
	</div>
{:else}
	<div class="p-2 flex gap-4">
		<div class="w-[40px] h-[40px] relative">
			<img
				src={avatar}
				alt={`${fullname}-${id}`}
				class="w-full h-full rounded-full object-cover"
				width="40"
				height="40"
				loading="lazy"
				decoding="async"
			/>
			<div
				class="w-[16px] h-[16px] absolute bottom-0 right-0 rounded-full border-solid border border-[#C0BFBE] bg-white"
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
			<p class="text-sm leading-5 text-text-01 underline mb-1">{fullname}</p>
			<p class="text-xs leading-4 text-text-02">พรรค{party.name}</p>
			<p class="text-xs leading-4 text-text-02">{role}</p>
		</div>
	</div>
{/if}
