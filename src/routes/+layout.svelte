<script lang="ts">
	import { handleStorageEvent, setTheme } from '$lib';
	import { THEME_STORE } from '$lib/theme/themeStore';
	import { onMount } from 'svelte';
	import '../app.css';
	let { children } = $props();

	onMount(() => {
		if (typeof window !== 'undefined') {
			const storedTheme = localStorage.getItem('theme') as App.Theme | null;
			setTheme(storedTheme || 'system');
			if ($THEME_STORE === 'system') {
				const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
				mediaQuery.addEventListener('change', () => {
					setTheme('system');
				});
			}
		}

		window.addEventListener('storage', handleStorageEvent);
		return () => {
			window.removeEventListener('storage', handleStorageEvent);
		};
	});
</script>

{@render children()}
