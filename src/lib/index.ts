import { THEME_STORE } from './theme/themeStore';

export const setLocal = (key: string, value: string) => localStorage.setItem(key, value);

export const shuffle = (arr: string[]) => {
	let currentIndex = arr.length,
		temporaryValue,
		randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		temporaryValue = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temporaryValue;
	}
	return arr;
};

export async function practiceWords(
	concentratedAlphabets: string[],
	exerciseType: 'words' | 'sentences' | 'paragraph' | 'code' | 'pattern',
	wordLength: number
): Promise<string> {
	console.time('practiceWords');
	if (!concentratedAlphabets || concentratedAlphabets.length === 0) {
		throw new Error('concentratedAlphabets must contain at least one letter.');
	}

	if (wordLength < 4 || wordLength > 50) {
		throw new Error('wordLength should be between 4 and 50.');
	}
	// @ts-expect-error - AI api is experimental and only supported in canary version of Chrome.
	const isLanguageModelAvailable = await LanguageModel.availability();
	console.log('Is Language Mode Avaiable', isLanguageModelAvailable);
	if (!isLanguageModelAvailable) {
		throw new Error('Language model is not available. Please check your browser version.');
	}
	const session = await LanguageModel.create();
	const letters = concentratedAlphabets.join(', ');
	let prompt: string;
	switch (exerciseType) {
		case 'words':
			prompt = `Generate 10 random words prominently featuring the letters: ${letters}. Each word should be ${wordLength} characters long, natural, and easy to type.`;
			break;

		case 'sentences':
			prompt = `Write a sentence of ${wordLength} words where the letters "${letters}". Make it meaningful for typing practice.`;
			break;

		case 'paragraph':
			prompt = `Write a short paragraph (50-100 words) where the letters ${letters} comprise at least 30% of the text. Keep it coherent and suitable for typing practice.`;
			break;

		case 'code':
			prompt = `Create a block of pseudo-code or programming code where the letters ${letters} appear frequently. Ensure it has meaningful structure, like a function or script.`;
			break;

		case 'pattern':
			prompt = `Generate a sequence of 10 random letter combinations emphasizing the letters: ${letters}. Each combination should be 5–10 characters long, separated by spaces.`;
			break;

		default:
			throw new Error(
				`Invalid exercise type: ${exerciseType}. Expected 'words', 'sentences', 'paragraph', 'code', or 'pattern'.`
			);
	}
	let result = '';
	let attempts = 0;
	const maxRetries = 10;
	console.log('prompt:', prompt);
	while (result.length == 0 && attempts < maxRetries) {
		console.log('attempts', attempts);
		console.log('maxRetries', maxRetries);
		attempts++;
		try {
			result = await session.prompt(prompt);
		} catch (error) {
			console.error('Error during AI session:', error);
		}
	}
	console.timeEnd('practiceWords');
	console.log('result', result);
	return result.trim();
}

export const setTheme = (newTheme: App.Theme) => {
	THEME_STORE.set(newTheme);
	if (newTheme === 'dark') {
		document.documentElement.classList.add('dark');
		document.documentElement.classList.remove('light');
	} else if (newTheme === 'light') {
		document.documentElement.classList.add('light');
		document.documentElement.classList.remove('dark');
	} else {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else {
			document.documentElement.classList.add('light');
			document.documentElement.classList.remove('dark');
		}
	}
	localStorage.setItem('theme', newTheme);
};

export const handleStorageEvent = (event: StorageEvent) => {
	if (event.key === 'theme' && event.newValue) {
		setTheme(event.newValue as App.Theme);
	}
};
