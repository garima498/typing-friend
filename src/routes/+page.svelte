<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const productId = $page.params.productId;

	import data from '../data';

	onMount(() => {});

	let timer: number | null = null;
	let blinkTimer: number | null = null;
	let seconds = 0;
	let type = 'word';
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

	const randomWordGenerator = () => {
		let result = [];
		let res = data.words;
		for (let index = 0; index < res.length; index++) {
			if (res[index].includes('a')) {
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

	function addSpan() {
		let stage = document.querySelector('#stage');
		randomWordGenerator()
			.split('')
			.forEach((character) => {
				if (stage) {
					let characterSpan = document.createElement('span');
					if (character == ' ') {
						character = '␣';
					}
					characterSpan.innerText = character;
					stage.append(characterSpan);
					if (character == '␣') {
						stage.append(document.createElement('wbr'));
					}
				}
			});
		blinkSpan();
	}

	function stageOnClick() {
		console.log('stage clicked');
		let stage = document.querySelector('#stage');
		let msg = document.querySelector('#msg-area');

		if (stage && stage.classList.contains('disabled') && msg) {
			stage.classList.remove('disabled');
			msg.classList.add('hidden');
			msg.classList.remove('show');
			const arr = stage.children;
			// blinkFun(arr[curCount]);
		} else if (stage && msg) {
			msg.classList.remove('hidden');
			msg.classList.add('show');
			stage.classList.add('disabled');
			const arr = stage.children;
			arr[curCount].classList.remove('blink');
			if (blinkTimer) {
				clearInterval(blinkTimer);
				blinkTimer = null;
			}
		}
	}

	const getLocal = (key: string) => localStorage.getItem(key);
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
		// const arr = main.querySelectorAll('span');
		const arr = stage?.children || [];
		arr[0].classList.add('blink');
	};

	const randomFixedInteger = (length: number) =>
		Math.floor(
			Math.pow(10, length - 1) +
				Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
		);

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

	const addSpanToChar = () => {
		let stage = document.querySelector('#stage');
		randomWordGenerator()
			.split('')
			.forEach((character) => {
				let characterSpan = document.createElement('span');
				if (character == ' ') {
					character = '␣';
				}
				characterSpan.innerText = character;
				if (stage) {
					stage.append(characterSpan);
					if (character == '␣') {
						stage.append(document.createElement('wbr'));
					}
				}
			});
		blinkSpan();
	};

	const getRandomWords = () => {
		let result = [];
		let res = shuffle(data.words);
		if (type === 'char') {
			if (currentWord) {
				for (let index = 0; index < msgWordCount; index++) {
					let semaphore = true;
					while (semaphore) {
						let number = randomFixedInteger(wordLength);
						let a = number.toString().split('');
						for (let index = 0; index < a.length; index++) {
							const element = a[index];
							if (element == currentWord) {
								result.push(a.join(''));
								semaphore = false;
								break;
							}
						}
					}
					if (result.length >= msgWordCount) {
						break;
					}
				}
			} else if (currentWord == currentWord.toUpperCase()) {
				for (let index = 0; index < res.length; index++) {
					if (res[index].includes(currentWord.toLowerCase()) && res[index].length == wordLength) {
						let a = res[index].split('');
						for (let index = 0; index < a.length; index++) {
							if (a[index] === currentWord.toLowerCase()) {
								a[index] = a[index].toUpperCase();
							}
						}
						result.push(a.join(''));
						if (result.length >= msgWordCount) {
							break;
						}
					}
				}
			} else if (currentWord == currentWord.toLowerCase()) {
				for (let index = 0; index < res.length; index++) {
					if (res[index].includes(currentWord) && res[index].length == wordLength) {
						result.push(res[index]);
						if (result.length >= msgWordCount) {
							break;
						}
					}
				}
			}
		} else {
			for (let index = 0; index < res.length; index++) {
				if (res[index].length == wordLength) {
					result.push(res[index]);
					if (result.length >= msgWordCount) {
						break;
					}
				}
			}
		}
		result.push('');
		msgWord = result.length;
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
		let stage = document.querySelector('stage');
		// let errorElement = document.querySelector('#error');
		const wordSpan = document.querySelector('#wordSpan');
		// const speed = document.getElementById('speed');
		// const avgSpeed = document.getElementById('avgSpeed');
		const currentWordInput = document.getElementById('currentWord') as HTMLInputElement;

		window.addEventListener('keydown', (e) => {
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
				if (data.charArray.includes(key) || data.symbols.includes(key)) {
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
							if (msgWord <= 1) {
								addSpanToChar();
							}
						} else {
							arr[curCount].classList.add('wrong');
							error++;
							// if (errorElement) {
							// 	errorElement.textContent = `Errors: ${error}`;
							// }
						}
					}
				}
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
</script>

<div class="results">
	<div id="speed">Speed: {wordCount.toFixed(1)}</div>
	<div id="avgSpeed">Avg Speed: {avg.toFixed(1)}</div>
	<!-- <div id="accuracy">Accuracy: 0</div> -->
	<!-- <div id="Score">Score: 0</div> -->
	<div id="error">Errors: {error}</div>
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="stage" on:click={() => stageOnClick()}>Typing Area</div>
<div class="hidden my-2" id="msg-area">
	<h3>Click again to enable...</h3>
</div>
<div class="hide" id="wordDiv">
	Your Input:&nbsp; <span id="wordSpan" />
</div>
<div />
