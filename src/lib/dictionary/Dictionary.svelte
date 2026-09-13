<script lang="ts">
	import type { Dictionary } from '$lib/dictionary/dictionary';
	import Search from '$lib/dictionary/Search.svelte';
	import WordPanel from '$lib/dictionary/WordPanel.svelte';
	import type { Word } from '$lib/server/preprocess';

	const { data: dictionary }: { data: Dictionary } = $props();
	let currentWord: Word | null = $state(null);
</script>

<div
	class="flex w-full flex-col overflow-hidden rounded-2xl bg-white/80 shadow-xl ring-1 shadow-black/5 ring-paper-200/80 backdrop-blur-sm md:h-120 md:flex-row dark:bg-white/5 dark:shadow-black/40 dark:ring-paper-800"
>
	<div
		class="flex min-h-0 flex-col border-b border-paper-200 md:w-72 md:shrink-0 md:border-r md:border-b-0 dark:border-paper-800"
	>
		<Search
			{dictionary}
			selected={currentWord}
			onSelect={(word) => {
				currentWord = word;
			}}
		/>
	</div>

	<div class="flex min-h-0 flex-1 flex-col">
		{#if currentWord !== null}
			<WordPanel
				{dictionary}
				word={currentWord}
				onWord={(word) => {
					currentWord = word;
				}}
			/>
		{:else}
			<div class="grid flex-1 place-items-center px-6 py-14 text-paper-500 dark:text-paper-400">
				<div class="max-w-xs text-center">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.25"
						class="mx-auto mb-4 size-12 text-paper-300 dark:text-paper-700"
						aria-hidden="true"
					>
						<path d="M12 4v7m0 0-4 5m4-5 4 5" stroke-linecap="round" />
						<circle cx="12" cy="3" r="1.6" />
						<circle cx="7" cy="17.5" r="1.6" />
						<circle cx="17" cy="17.5" r="1.6" />
					</svg>
					<p class="font-serif text-lg text-paper-700 dark:text-paper-200">
						Wortfamilien entdecken
					</p>
					<p class="mt-1.5 text-sm">
						Suchen Sie ein deutsches Wort, um alle verwandten Wörter zu sehen.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
