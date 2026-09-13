<script lang="ts">
	import { type Dictionary, WORD_TYPE_META } from '$lib/dictionary/dictionary';
	import { type Word, WORD_TYPES, type WordType } from '$lib/dictionary/types';

	const {
		word,
		onWord,
		dictionary
	}: { word: Word; onWord: (word: Word) => void; dictionary: Dictionary } = $props();

	const relatives: Word[] = $derived(
		dictionary.groups[word.groupId]
			.filter((other) => other.word !== word.word)
			.sort((a, b) => a.word.localeCompare(b.word, 'de'))
	);
	const relativesByType = $derived.by(() => {
		const result: Record<WordType, Word[]> = { Noun: [], Verb: [], Adjective: [], Other: [] };
		relatives.forEach((related) => {
			result[related.type].push(related);
		});
		return result;
	});
	const meta = $derived(WORD_TYPE_META[word.type]);
</script>

<div class="flex min-h-0 flex-col">
	<header class="border-b border-paper-100 px-6 py-4 dark:border-paper-800">
		<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
			<h2
				class="font-serif text-2xl font-semibold wrap-break-word text-paper-900 dark:text-paper-50"
			>
				<a
					href="https://de.wiktionary.org/wiki/{word.word}"
					target="_blank"
					class="hover:text-ink-700 dark:hover:text-ink-300"
					title="Show '{word.word}' in wiktionary"
				>
					{word.word}
				</a>
			</h2>
			<span class="rounded px-1.5 py-0.5 text-xs font-medium {meta.classes}">{meta.label}</span>

			{#if word.firstPersonSingular.length > 0}
				<span
					class="flex flex-wrap items-baseline gap-x-1.5 font-serif text-sm text-paper-700 dark:text-paper-300"
				>
					{#each word.firstPersonSingular as fps (fps)}
						<span
							class="not-first:before:mr-1.5 not-first:before:text-paper-300 not-first:before:content-['·'] dark:not-first:before:text-paper-700"
						>
							ich {fps}
						</span>
					{/each}
				</span>
			{/if}
		</div>

		{#if word.englishTranslations.length > 0}
			<span
				lang="en"
				class="flex flex-wrap items-baseline gap-x-1.5 font-serif text-sm text-paper-700 italic dark:text-paper-300"
			>
				{#each word.englishTranslations as translation (translation)}
					<span
						class="not-first:before:mr-1.5 not-first:before:text-paper-300 not-first:before:content-['·'] dark:not-first:before:text-paper-700"
					>
						{translation}
					</span>
				{/each}
			</span>
		{/if}

		<p
			class="mt-2 text-[0.7rem] font-medium tracking-[0.08em] text-paper-400 uppercase dark:text-paper-500"
		>
			{#if relatives.length === 0}
				Keine verwandten Wörter
			{:else}
				{relatives.length} verwandte {relatives.length === 1 ? 'Wortform' : 'Wortformen'}
			{/if}
		</p>
	</header>

	<div class="scroll-thin overflow-scroll">
		{#if word.examples.length > 0}
			<section class="shrink-0 border-b border-paper-100 px-6 py-4 dark:border-paper-800">
				<h3 class="text-xs tracking-wide text-paper-500 uppercase dark:text-paper-400">
					Beispiele
				</h3>
				<ul class="scroll-thin mt-2 max-h-36 space-y-2 overflow-y-auto overscroll-contain pr-1">
					{#each word.examples as example (example)}
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
			{#snippet related_words(words: Word[])}
				<ul class="grid min-h-24 grid-cols-1 content-start gap-1 p-3 sm:grid-cols-2">
					{#each words as other (other)}
						{@const otherMeta = WORD_TYPE_META[other.type]}
						<li>
							<button
								title="{other.word} — {otherMeta.label} anzeigen"
								onclick={() => onWord(other)}
								class="group flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-paper-100 dark:hover:bg-paper-800/60"
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
							</button>
						</li>
					{/each}
				</ul>
			{/snippet}

			{#each WORD_TYPES as wordType (wordType)}
				{@render related_words(relativesByType[wordType])}
			{/each}
		{/if}
	</div>
</div>
