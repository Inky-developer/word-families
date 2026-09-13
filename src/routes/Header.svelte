<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const links = [
		{ href: resolve('/'), label: 'Wörterbuch' },
		{ href: resolve('/about'), label: 'Über' }
	];
</script>

<header
	class="sticky top-0 z-10 border-b border-paper-200 bg-white/70 backdrop-blur-md dark:border-paper-800 dark:bg-black/30"
>
	<div class="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
		<a href={resolve('/')} class="group flex items-center gap-2.5">
			<span
				class="grid size-8 place-items-center rounded-lg bg-ink-600 font-serif text-lg leading-none font-semibold text-white shadow-sm"
				aria-hidden="true">W</span
			>
			<span class="flex flex-col leading-tight">
				<span class="font-serif text-base font-semibold text-paper-900 dark:text-paper-50">
					Wortfamilien
				</span>
				<span class="text-[0.7rem] tracking-wide text-paper-500 uppercase dark:text-paper-400">
					Deutsch
				</span>
			</span>
		</a>

		<nav class="ml-auto">
			<ul class="flex items-center gap-1">
				{#each links as link (link.href)}
					{@const current = page.url.pathname === link.href}
					<li>
						<a
							href={link.href}
							aria-current={current ? 'page' : undefined}
							class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-paper-200/70 dark:hover:bg-paper-800
								{current
								? 'bg-paper-200/60 text-ink-700 dark:bg-paper-800 dark:text-ink-300'
								: 'text-paper-500 dark:text-paper-400'}"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>
