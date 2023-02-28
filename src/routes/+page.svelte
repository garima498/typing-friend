<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const productId = $page.params.productId;

	import data from '../data';

	let timer: number | null = null;
	let blinkTimer: number | null = null;
	let seconds = 0;
	let type = 'char';
	let word: string[] = [];
	let curCount = 0;
	let error = 0;
	let msgWord = 0;
	let currentWord = 'a';
	let msgWordCount = 5;
	let wordLength = 5;
	let wordCount = 0;
	let speedArray: number[] = [];
	let blink = true;
	let pause = false;
	let pauseSecondsInterval: number | null = null;
	let pauseSeconds = 2;
	let avg = 0;
	let disabled = '';

	const randomWordGenerator = () => {
		let result = [];
		let res = data.words;
		for (let index = 0; index < res.length; index++) {
			if (res[index].includes(currentWord)) {
				result.push(res[index]);
				if (result.length >= 20) {
					break;
				}
			}
		}
		return result.join(' ');
	};

	const blinkSpan = () => {
		let stage = document.querySelector('#stage');
		const arr = stage?.children || [];
		if (arr.length > 0) {
			arr[0].classList.add('blink');
		}
	};

	const setLocal = (key: string, value: string) => localStorage.setItem(key, value);

	const renderNewWords = () => {
		let stage = document.querySelector('#stage');
		if (stage) {
			stage.textContent = '';
		}
		curCount = 0;
		const wordsArray = getRandomWords();
		type === 'char'
			? wordsArray.split('').forEach((character) => {
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
			  })
			: wordsArray.split(' ').map((e) => {
					const characterSpan = document.createElement('span');
					characterSpan.innerText = e;
					characterSpan.classList.add('word');
					if (stage) {
						stage.appendChild(characterSpan);
						stage.appendChild(document.createElement('wbr'));
					}
			  });
		const arr = stage?.children || [];
		arr[0].classList.add('blink');
	};

	// const randomFixedInteger = (length: number) =>
	// 	Math.floor(
	// 		Math.pow(10, length - 1) +
	// 			Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
	// 	);

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
		} else {
			// clearInterval(blinkTimer);
		}
	};

	const getRandomWords = () => {
		let result: string[] = [];
		// let res = shuffle(data.words);
		// if (type === 'char') {
		// 	if (currentWord) {
		// 		for (let index = 0; index < msgWordCount; index++) {
		// 			let semaphore = true;
		// 			while (semaphore) {
		// 				let number = randomFixedInteger(wordLength);
		// 				let a = number.toString().split('');
		// 				for (let index = 0; index < a.length; index++) {
		// 					const element = a[index];
		// 					if (element == currentWord) {
		// 						result.push(a.join(''));
		// 						semaphore = false;
		// 						break;
		// 					}
		// 				}
		// 			}
		// 			if (result.length >= msgWordCount) {
		// 				break;
		// 			}
		// 		}
		// 	} else if (currentWord == currentWord.toUpperCase()) {
		// 		for (let index = 0; index < res.length; index++) {
		// 			if (res[index].includes(currentWord.toLowerCase()) && res[index].length == wordLength) {
		// 				let a = res[index].split('');
		// 				for (let index = 0; index < a.length; index++) {
		// 					if (a[index] === currentWord.toLowerCase()) {
		// 						a[index] = a[index].toUpperCase();
		// 					}
		// 				}
		// 				result.push(a.join(''));
		// 				if (result.length >= msgWordCount) {
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	} else if (currentWord == currentWord.toLowerCase()) {
		// 		for (let index = 0; index < res.length; index++) {
		// 			if (res[index].includes(currentWord) && res[index].length == wordLength) {
		// 				result.push(res[index]);
		// 				if (result.length >= msgWordCount) {
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	}
		// } else {
		// 	for (let index = 0; index < res.length; index++) {
		// 		if (res[index].length == wordLength) {
		// 			result.push(res[index]);
		// 			if (result.length >= msgWordCount) {
		// 				break;
		// 			}
		// 		}
		// 	}
		// }
		// result.push('');
		// msgWord = result.length;
		return result.join(' ');
	};

	const shuffle = (arr: string[]) => {
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

	const onEveryKeyPress = () => {
		let stage = document.querySelector('#stage');
		const wordSpan = document.querySelector('#wordSpan');
		const currentWordInput = document.getElementById('currentWord') as HTMLInputElement;

		window.addEventListener('keydown', (e) => {
			e.preventDefault();
			pause = false;
			if (!timer) {
				timer = window.setInterval(() => {
					if (!pause) {
						seconds++;
					}
				}, 200);
			}

			let key = e.key;

			if (stage && !stage.classList.contains('disabled')) {
				// if (data.charArray.includes(key) || data.symbols.includes(key)) {
				const arr = stage.querySelectorAll('span');
				if (type === 'word') {
					if (e.code === 'Backspace') {
						word = data.words.slice(0, -1);
						if (wordSpan) {
							wordSpan.textContent = word.join('');
						}
					} else if (e.code === 'Space') {
						if (arr[curCount].innerText === '␣') {
							arr[curCount].classList.remove('correctWord');
							arr[curCount].classList.add('correct');
						} else {
							arr[curCount].classList.remove('wrongWord');
							arr[curCount].classList.add('incorrect');
						}
						arr[curCount].classList.remove('blink');
					} else {
						word.push(key);
						if (wordSpan) {
							wordSpan.textContent = word.join('');
						}
					}
					if (e.code !== 'Space') {
						if (arr[curCount].innerText.includes('word')) {
							if (arr[curCount].classList.contains('wrongWord')) {
								arr[curCount].classList.remove('wrongWord');
							}
						} else {
							if (!arr[curCount].classList.contains('wrongWord')) {
								arr[curCount].classList.add('wrongWord');
								error++;
							}
						}
					}
					msgWord <= 1 ? renderNewWords() : null;
				} else {
					console.log('eKey:', e.key, 'eCode:', e.code, 'Current:', arr[curCount].innerText);
					if (
						e.key == arr[curCount].innerText ||
						(e.code === 'Space' && arr[curCount].innerText === '␣')
					) {
						if (e.code === 'Space') {
							wordCount++;
							msgWord--;
							if (msgWord <= 1 && timer) {
								let temp = 300 / seconds;
								wordCount = wordCount * temp;
								speedArray.push(parseFloat(wordCount.toFixed(3)));
								let sum = 0;
								speedArray.forEach((element) => {
									sum += element;
								});
								avg = sum / speedArray.length;
								// if (errorElement) {
								// 	errorElement.textContent = `Errors: ${error}`;
								// }
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
								wordCount = 0;
							}
						}
						arr[curCount].classList.add('correct');
						arr.forEach((element) => {
							if (element.classList.contains('wrong')) {
								arr[curCount].classList.remove('correct');
								element.classList.remove('wrong');
								element.classList.add('incorrect');
							}
						});
						arr[curCount].classList.remove('blink');
						curCount++;
						curCount < arr.length ? blinkFun(arr[curCount]) : null;
						// if (msgWord <= 1) {
						// 	addSpanToChar();
						// }
					} else {
						arr[curCount].classList.add('wrong');
						error++;
						// if (errorElement) {
						// 	errorElement.textContent = `Errors: ${error}`;
						// }
					}
				}
				// }
			}
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

	// Add conditionals slice to wordArray and add to stage

	let wordArray: string[] = [];
	onMount(() => {
		if (type !== 'word') {
			let res = shuffle(data.words);
			let x: string[] = [];
			for (let index = 0; index < res.length; index++) {
				if (res[index].includes(currentWord) && res[index].length == wordLength) {
					x.push(res[index]);
					if (x.length >= msgWordCount) {
						break;
					}
				}
			}
			wordArray = x;
		}

		onEveryKeyPress();
	});
</script>

<div id="typing-master">
	<div class="results">
		<div id="speed">Speed: {wordCount.toFixed(1)}</div>
		<div id="avgSpeed">Avg Speed: {avg.toFixed(1)}</div>
		<div id="accuracy">Accuracy: 0</div>
		<div id="Score">Score: 0</div>
		<div id="error">Errors: {error}</div>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="stage-container">
		<div
			id="stage"
			on:click={() => (disabled = disabled === 'disabled' ? '' : 'disabled')}
			class="stage {disabled === 'disabled' ? 'disabled' : ''}"
		>
			{#if type === 'word'}
				{#each data.words as word}
					{#if word === ' '}
						<wbr />
					{:else}
						<span class="blink">{word}</span>
					{/if}
				{/each}
			{:else}
				{#each wordArray as char, i}
					<span class={i == 0 ? 'blink' : ''}>{char}</span>&nbsp;
				{/each}
			{/if}
		</div>
		<div
			id="msg-area"
			on:click={() => (disabled = disabled === 'disabled' ? '' : 'disabled')}
			class="{disabled !== 'disabled' ? 'hidden' : 'msg-not-hidden'} my-2"
		>
			<h3>Click again to enable...</h3>
		</div>
	</div>
	<!-- <div class="hide" id="wordDiv">
		Your Input:&nbsp; <span id="wordSpan" />
	</div> -->

	<div class="blink" />
</div>

<style>
	.stage-container {
		display: grid;
		place-items: center;
		grid-template-columns: 1fr;
		grid-template-areas: 'overlap';
	}

	.hidden {
		display: none;
	}

	.msg-not-hidden {
		color: black;
		grid-area: overlap;
		font-size: 34px;
	}

	.stage {
		background-color: white;
		border-radius: 20px;
		box-shadow: 1px 4px 11px -3px rgba(0, 200, 250, 0.67);
		font-size: 34px;
		min-width: 85%;
		width: 85%;
		padding: 20px;
		user-select: none;
		word-wrap: break-word;
		margin: 10px 0px;
		grid-area: overlap;
	}

	.disabled {
		color: rgba(126, 126, 126, 0.178);
	}

	#typing-master {
		display: flex;
		flex-direction: column;
		text-align: center;
		align-items: center;
		gap: 15px;
		font-size: 16px;
		min-height: calc(100vh - 60px);
	}
	.results {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		margin-top: 20px;
		font-size: 28px;
		text-shadow: 2px 1px 5px rgb(128 128 128 / 20%);
	}

	.results > div {
		padding: 5px 10px;
		border-radius: 8px;
		background-color: #ffffff;
		box-shadow: 1px 4px 11px -3px rgba(0, 200, 250, 0.67);
	}

	.blink {
		background-color: black;
		color: white;
	}
</style>
