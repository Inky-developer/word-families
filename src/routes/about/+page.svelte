<script lang="ts">
	import github from '$lib/images/github.svg';
</script>

<svelte:head>
	<title>Über</title>
	<meta name="description" content="Über diese App" />
</svelte:head>

<main class="text-column">
	<h1 class="text-xl">Über diese App</h1>

	<p>
		Der Quellcode ist auf
		<a
			href="https://github.com/Inky-developer/word-families"
			class="inline-flex items-center gap-1 text-paper-700 hover:underline dark:text-paper-400"
		>
			<img src={github} alt="GitHub" class="h-[1em] w-auto dark:invert" />
			GitHub
		</a>
		verfügbar.
	</p>
</main>
