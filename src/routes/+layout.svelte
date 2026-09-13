<script lang="ts">
	import Header from './Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
		{@render children()}
	</main>

	<footer class="px-4 py-8 text-center text-xs text-paper-500 dark:text-paper-400">
		<p>
			Wortdaten aus
			<a
				class="underline decoration-paper-300 underline-offset-2 hover:text-ink-600 dark:hover:text-ink-300"
				href="https://www.ims.uni-stuttgart.de/documents/ressourcen/lexika/derivbase/derivcelex-v2.txt"
				target="_blank"
				rel="noreferrer"
			>
				DErivCELEX
			</a>
			· Universität Stuttgart
		</p>
	</footer>
</div>
