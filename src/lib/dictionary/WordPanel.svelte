<script lang="ts">
	import { type Dictionary, WORD_TYPE_META } from '$lib/dictionary/dictionary';
	import type { Word } from '$lib/server/preprocess';

	const { word, dictionary }: { word: Word; dictionary: Dictionary } = $props();

	const relatives: Word[] = $derived(
		dictionary.groups[word.groupId]
			.filter((other) => other.word !== word.word && other.type == 'Verb')
			.sort((a, b) => a.word.localeCompare(b.word, 'de'))
	);
	const meta = $derived(WORD_TYPE_META[word.type]);
</script>

<div class="flex min-h-0 flex-col">
	<header class="border-b border-paper-100 px-6 py-4 dark:border-paper-800">
		<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
			<h2
				class="font-serif text-2xl font-semibold wrap-break-word text-paper-900 dark:text-paper-50"
			>
				{word.word}
			</h2>
			<span class="rounded px-1.5 py-0.5 text-xs font-medium {meta.classes}">{meta.label}</span>
		</div>

		<p class="mt-1 text-xs tracking-wide text-paper-500 uppercase dark:text-paper-400">
			{#if relatives.length === 0}
				Keine verwandten Wörter
			{:else}
				{relatives.length} verwandte {relatives.length === 1 ? 'Wortform' : 'Wortformen'}
			{/if}
		</p>
	</header>

	{#if word.examples.length > 0}
		<section class="shrink-0 border-b border-paper-100 px-6 py-4 dark:border-paper-800">
			<h3 class="text-xs tracking-wide text-paper-500 uppercase dark:text-paper-400">Beispiele</h3>
			<ul class="scroll-thin mt-2 max-h-28 space-y-2 overflow-y-auto overscroll-contain pr-1">
				{#each word.examples as example, index (index)}
					<li
						class="border-l-2 border-ink-500/30 pl-3 font-serif text-sm text-paper-700 italic dark:border-ink-300/30 dark:text-paper-200"
					>
						{example}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if relatives.length === 0}
		<p class="px-6 py-10 text-center text-sm text-paper-500 dark:text-paper-400">
			Dieses Wort steht allein in seiner Wortfamilie.
		</p>
	{:else}
		<ul
			class="scroll-thin grid min-h-0 flex-1 grid-cols-1 content-start gap-1 overflow-y-auto overscroll-contain p-3 sm:grid-cols-2"
		>
			{#each relatives as other (other)}
				{@const otherMeta = WORD_TYPE_META[other.type]}
				<li>
					<a
						href="https://de.wiktionary.org/wiki/{encodeURIComponent(other.word)}"
						target="_blank"
						rel="noreferrer"
						title="{other.word} — {otherMeta.label} auf Wiktionary nachschlagen"
						class="group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-paper-100 dark:hover:bg-paper-800/60"
					>
						<span
							class="min-w-0 flex-1 truncate text-paper-800 group-hover:text-ink-700 dark:text-paper-100 dark:group-hover:text-ink-300"
						>
							{other.word}
						</span>
						<span
							class="shrink-0 rounded px-1.5 py-0.5 text-[0.65rem] font-medium {otherMeta.classes}"
						>
							{otherMeta.short}
						</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-3.5 shrink-0 text-paper-400 opacity-0 transition-opacity group-hover:opacity-100"
							aria-hidden="true"
						>
							<path
								d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"
							/>
						</svg>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
