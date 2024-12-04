<script lang="ts">
	import { setTheme } from '$lib';
	import { THEME_STORE } from '$lib/theme/themeStore';
	import Moon from '../svg_icons/Moon.svelte';
	import Setting from '../svg_icons/Setting.svelte';
	import Sun from '../svg_icons/Sun.svelte';

	let isDropdownOpen = false;

	const isSystemDarkMode = () => {
		if (typeof window !== 'undefined') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		} else {
			return false;
		}
	};

	const updateTheme = (theme: App.Theme) => {
		setTheme(theme);
		isDropdownOpen = false;
	};
</script>

<div class="flex w-full justify-end px-20">
	<div class="relative inline-block text-left">
		<button
			class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow transition duration-200 ease-in-out dark:bg-zinc-800 dark:text-white"
			on:click={() => (isDropdownOpen = !isDropdownOpen)}
			aria-label="Selected theme"
		>
			{#if $THEME_STORE === 'dark'}
				<Moon />
			{:else if $THEME_STORE === 'light'}
				<Sun />
			{:else if isSystemDarkMode()}
				<Moon />
			{:else}
				<Sun />
			{/if}
		</button>
		{#if isDropdownOpen}
			<div class="absolute right-0 mt-2 rounded-lg bg-white shadow-lg dark:bg-zinc-800">
				<button
					class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-black hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
					on:click={() => updateTheme('light')}
					aria-label="Switch to light theme"
				>
					<Sun />
				</button>
				<button
					class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-black hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
					on:click={() => updateTheme('dark')}
					aria-label="Switch to dark theme"
				>
					<Moon />
				</button>
				<button
					class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-black hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
					on:click={() => updateTheme('system')}
					aria-label="Switch to system theme"
				>
					<Setting />
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(html) {
		transition:
			background-color 0.3s,
			color 0.3s;
	}
</style>
