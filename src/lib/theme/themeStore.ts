import { writable } from "svelte/store";

export const THEME_STORE = writable<App.Theme>('system');