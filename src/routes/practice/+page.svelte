<!-- Practice -->
<script lang="ts">
	import { practiceWords, setLocal } from '$lib';
	import { ignoreKeys } from '$lib/practice/utils';
	import { onMount } from 'svelte';
	import Card from '../../components/Card.svelte';
	import data from '../../data';

	let timer: number | null = null;
	let blinkTimer: number | null = null;
	let seconds = 0;
	let type = 'char';
	let word: string[] = [];
	let currentWord: string = 'a';
	let curCount = 0;
	let error = 0;
	let wordLength = 8;
	let wordCount = 0;
	let speedArray = [0.0];
	let blink = true;
	let pause = false;
	let pauseSecondsInterval: number | null = null;
	let pauseSeconds = 2;
	let avg = 0;
	let disabled = '';

	const blinkSpan = () => {
		let stage = document.querySelector('#stage');
		const arr = stage?.children || [];
		if (arr.length > 0) {
			arr[0].classList.add('blink');
		}
	};

	const renderNewWords = async () => {
		let stage = document.querySelector('#stage');
		if (stage) {
			stage.textContent = '';
		}
		curCount = 0;
		const wordsArray = await practiceWords([currentWord], 'sentences', wordLength);
		if (type === 'char') {
			wordsArray.split('').forEach((character) => {
				const characterSpan = document.createElement('span');
				if (character == ' ') {
					character = '␣';
				}
				characterSpan.innerText = character;
				if (stage) {
					stage.appendChild(characterSpan);
					if (character == '␣') {
						stage.appendChild(document.createElement('wbr'));
					}
				}
			});
		} else {
			wordsArray.split(' ').map((e) => {
				const characterSpan = document.createElement('span');
				characterSpan.innerText = e;
				characterSpan.classList.add('word');
				if (stage) {
					stage.appendChild(characterSpan);
					stage.appendChild(document.createElement('wbr'));
				}
			});
		}
		const arr = stage?.children || [];
		if (arr.length > 0) {
			arr[0].classList.add('blink');
		}
	};

	const blinkFun = (element: HTMLElement) => {
		element.classList.add('blink');
		if (blink) {
			if (blinkTimer) {
				clearInterval(blinkTimer);
				blinkTimer = null;
			}
			if (!blinkTimer) {
				blinkTimer = window.setInterval(() => {
					element.classList.toggle('blink');
				}, 400);
			}
		}
	};

	const onEveryKeyPress = () => {
		let stage = document.querySelector('#stage');
		const wordSpan = document.querySelector('#wordSpan');
		const currentWordInput = document.getElementById('currentWord') as HTMLInputElement;

		window.addEventListener('keydown', async (e) => {
			e.preventDefault();
			pause = false;

			// Start the timer on the first key press
			if (!timer) {
				console.log(timer);
				console.log(pause);
				timer = window.setInterval(() => {
					if (!pause) {
						seconds++;
						console.log(seconds);
						console.log(wordCount);
						let tempSpeed = wordCount / seconds;
						speedArray = [...speedArray, tempSpeed];
						console.log(speedArray);
						let sum = speedArray.reduce((acc, val) => acc + val, 0);
						avg = sum / speedArray.length;
					}
				}, 1000); // Update every second
			}

			let key = e.key;
			if (
				stage &&
				!stage.classList.contains('disabled') &&
				ignoreKeys.includes(key.toLowerCase()) === false
			) {
				const arr = stage.querySelectorAll('span');
				if (type === 'word') {
					if (e.code === 'Space') {
						if (arr[curCount].innerText === '␣') {
							arr[curCount].classList.remove('correctWord');
							arr[curCount].classList.add('correct');
						} else {
							arr[curCount].classList.remove('wrongWord');
							arr[curCount].classList.add('incorrect');
						}
						arr[curCount].classList.remove('blink');
						curCount++;
						if (curCount < arr.length) {
							blinkFun(arr[curCount]);
						} else {
							renderNewWords();
						}
					} else {
						word.push(key);
						if (wordSpan) {
							wordSpan.textContent = word.join('');
						}
						if (arr[curCount].innerText !== key) {
							arr[curCount].classList.add('wrongWord');
							error++;
						} else {
							arr[curCount].classList.add('correct');
						}
					}
				} else {
					if (
						e.key == arr[curCount].textContent ||
						(e.code === 'Space' && arr[curCount].textContent === '␣')
					) {
						arr[curCount].classList.remove('blink');
						arr[curCount].classList.add('text-green-500');
						curCount++;

						// Increment word count on space
						if (e.code === 'Space') {
							wordCount++;
						}

						if (curCount < arr.length) {
							blinkFun(arr[curCount]);
						} else {
							currentWord = data.charArray[data.charArray.indexOf(currentWord) + 1];
							setLocal('currentWord', currentWord);
							if (currentWord === undefined) {
								currentWord = data.charArray[0];
								setLocal('currentWord', currentWord);
							}
							if (currentWordInput) {
								currentWordInput.value = currentWord;
							}
							clearInterval(timer);
							timer = null;
							seconds = 0;
							if (curCount === arr.length) {
								await renderNewWords();
							}
						}
					} else {
						arr[curCount].classList.add('text-red-500');
						error++;
					}
				}
			}

			// Handle pause
			if (!pauseSecondsInterval) {
				pauseSecondsInterval = window.setInterval(() => {
					pauseSeconds--;
					if (pauseSeconds <= 0) {
						pause = true;
					}
				}, 1000);
			}
		});
	};

	onMount(async () => {
		await renderNewWords();
		onEveryKeyPress();
	});
</script>

<div
	class="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-zinc-50 to-zinc-100 py-12 dark:from-zinc-900 dark:to-zinc-800"
>
	<div class="flex items-center justify-center gap-3 text-2xl shadow-sm">
		<Card className="p-6">
			<div>Speed: {speedArray[speedArray.length - 1].toFixed(1)}</div>
		</Card>
		<Card className="p-6">
			<div>Avg Speed: {avg.toFixed(1)}</div>
		</Card>
		<!-- <Card className="p-6">
			<div>Accuracy: 0</div>
		</Card>
		<Card className="p-6">
			<div>Score: 0</div>
		</Card> -->
		<Card className="p-6">
			<div>Errors: {error}</div>
		</Card>
	</div>
	<div id="typing-master" class="flex min-h-screen flex-col items-center gap-4 py-8 text-center">
		<div class="grid place-items-center gap-4">
			<button
				id="stage"
				tabindex="0"
				on:click={() => (disabled = disabled === 'disabled' ? '' : 'disabled')}
				class=" rounded-lg bg-white px-4 py-6 text-lg text-gray-900 shadow-md transition-transform
                duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-40
                 ">{' '}</button
			>
			<button
				id="msg-area"
				tabindex="0"
				on:click={() => (disabled = disabled === 'disabled' ? '' : 'disabled')}
				class="{disabled !== 'disabled' ? 'hidden' : ''} 
                rounded-md bg-gray-200 px-4 py-2 text-xl font-bold text-black"
			>
				<h3>Click again to enable...</h3>
			</button>
		</div>
	</div>
</div>

<style>
	:global(.blink) {
		background-color: black;
		color: white;
		animation: blink 1s steps(2, start) infinite;
	}
	@keyframes blink {
		to {
			visibility: hidden;
		}
	}
</style>
