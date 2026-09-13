<script lang="ts">
	import DictionaryComponent from '$lib/dictionary/Dictionary.svelte';
	import { Dictionary } from '$lib/dictionary/dictionary';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const dictionary = $derived(Dictionary.fromWords(data.content));
</script>

<svelte:head>
	<title>Wortfamilien — deutsche Wortfamilien nachschlagen</title>
	<meta
		name="description"
		content="Deutsches Wörterbuch der Wortfamilien: Suchen Sie ein Wort und sehen Sie alle davon abgeleiteten und verwandten Wortformen."
	/>
</svelte:head>

<section class="flex flex-1 flex-col justify-center gap-8">
	<div class="mx-auto max-w-xl text-center">
		<h1
			class="font-serif text-3xl font-semibold text-balance text-paper-900 sm:text-4xl dark:text-paper-50"
		>
			Deutsche Wortfamilien
		</h1>
		<p class="mt-3 text-base text-pretty text-paper-500 dark:text-paper-400">
			Ein Wort suchen und sehen, welche Wörter mit ihm verwandt sind – Ableitungen,
			Zusammensetzungen und Wortformen aus derselben Familie.
		</p>
	</div>

	<DictionaryComponent data={dictionary} />
</section>
