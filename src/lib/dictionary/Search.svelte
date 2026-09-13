<script lang="ts">
	import { WORD_TYPE_META, type Dictionary } from '$lib/dictionary/dictionary';
	import type { Word } from '$lib/server/preprocess';

	const {
		dictionary,
		selected,
		onSelect
	}: {
		dictionary: Dictionary;
		selected: Word | null;
		onSelect: (word: Word) => void;
	} = $props();

	/** Rendering every match of a one-letter query would mean thousands of nodes. */
	const MAX_RESULTS = 100;

	let query = $state('');

	const results: Word[] = $derived.by(() => {
		const trimmed = query.trim();
		if (trimmed.length === 0) return [];
		return dictionary.search(trimmed);
	});
	const shown = $derived(results.slice(0, MAX_RESULTS));

	const isSelected = (result: Word) =>
		selected !== null && selected.word === result.word && selected.groupId === result.groupId;

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' || shown.length === 0) return;
		event.preventDefault();
		onSelect(shown[0]);
	};
</script>

<div class="flex min-h-0 flex-col">
	<div class="p-3">
		<div class="relative">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-paper-400"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<input
				bind:value={query}
				onkeydown={onKeyDown}
				type="search"
				autocomplete="off"
				spellcheck="false"
				aria-label="Wort suchen"
				placeholder="Wort suchen…"
				class="w-full rounded-lg border border-paper-200 bg-white py-2 pr-3 pl-9 text-sm shadow-sm transition outline-none focus:border-ink-500 focus:ring-3 focus:ring-ink-500/30 dark:border-paper-700 dark:bg-black/20 dark:placeholder:text-paper-400"
			/>
		</div>
	</div>

	{#if query.trim().length > 0}
		<p
			class="border-y border-paper-100 px-4 py-1.5 text-[0.7rem] tracking-wide text-paper-500 uppercase dark:border-paper-800 dark:text-paper-400"
			aria-live="polite"
		>
			{#if results.length === 0}
				Keine Treffer
			{:else if results.length > MAX_RESULTS}
				{MAX_RESULTS} von {results.length} Treffern
			{:else}
				{results.length} Treffer
			{/if}
		</p>
	{/if}

	<ol class="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 max-md:max-h-64">
		{#each shown as result (result)}
			{@const meta = WORD_TYPE_META[result.type]}
			{@const active = isSelected(result)}
			<li>
				<button
					type="button"
					onclick={() => onSelect(result)}
					aria-current={active ? 'true' : undefined}
					class="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-paper-100 dark:hover:bg-paper-800/60
						{active ? 'bg-ink-600/10 dark:bg-ink-600/25' : ''}"
				>
					<span class="min-w-0 flex-1 truncate">
						<span class="text-paper-400 dark:text-paper-500"
							>{result.word.slice(0, query.trim().length)}</span
						><span
							class="font-medium text-paper-900 dark:text-paper-100
								{active ? 'text-ink-700 dark:text-ink-300' : ''}">{result.word.slice(query.trim().length)}</span
						>
					</span>
					<span
						class="shrink-0 rounded px-1.5 py-0.5 text-[0.65rem] font-medium {meta.classes}"
						title={meta.label}
					>
						{meta.short}
					</span>
				</button>
			</li>
		{/each}

		{#if query.trim().length === 0}
			<p class="px-3 py-6 text-center text-sm text-paper-400 dark:text-paper-500">
				Tippen Sie ein Wort, z.&nbsp;B. <span class="font-serif italic">arbeiten</span>.
			</p>
		{:else if results.length === 0}
			<p class="px-3 py-6 text-center text-sm text-paper-400 dark:text-paper-500">
				Kein Wort beginnt mit <span class="font-serif break-all italic">{query.trim()}</span>.
			</p>
		{/if}
	</ol>
</div>
