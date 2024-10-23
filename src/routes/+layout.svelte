<script>
	import { onMount } from 'svelte';

	function addActiveClass(x = '') {
		const trainingBtn = document.getElementById('training-btn');
		const practiceBtn = document.getElementById('practice-btn');
		const settingBtn = document.getElementById('setting-btn');

		if (trainingBtn && practiceBtn && settingBtn) {
			switch (x) {
				case 'practice':
					trainingBtn.classList.remove('active');
					practiceBtn.classList.add('active');
					settingBtn.classList.remove('active');
					break;
				case 'settings':
					trainingBtn.classList.remove('active');
					practiceBtn.classList.remove('active');
					settingBtn.classList.add('active');
					break;
				default:
					trainingBtn.classList.add('active');
					practiceBtn.classList.remove('active');
					settingBtn.classList.remove('active');
					break;
			}
		}
	}

	onMount(() => {
		if (location.pathname === '/training') addActiveClass();
		else if (location.pathname === '/practice') addActiveClass('practice');
		else if (location.pathname === '/settings') addActiveClass('settings');
		else addActiveClass();
	});
</script>

<div class="flex-data">
	<div class="sidebar">
		<a href="/" class="tm-button active" id="training-btn" onclick={() => addActiveClass()}
			>Training</a
		>
		<a
			href="practice"
			class="tm-button"
			id="practice-btn"
			onclick={() => addActiveClass('practice')}>Practice</a
		>
		<a
			href="settings"
			class="tm-button"
			id="setting-btn"
			onclick={() => addActiveClass('settings')}>Settings</a
		>
	</div>
	<main>
		<slot />
	</main>
</div>

<style>
	* {
		padding: 0px;
		margin: 0px;
		box-sizing: border-box;
		/* Remove text selection */
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
								  supported by Chrome, Opera and Firefox */
	}
	.flex-data {
		display: flex;
		height: 100vh;
	}
	main {
		width: calc(100% - 160px);
	}
	.sidebar {
		top: 0;
		left: 0;
		width: 160px;
		height: 100%;
		padding-left: 20px;
		padding-top: 2%;
		transition: all 0.5s ease;
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.tm-button {
		background-color: white;
		border: none;
		outline: none;
		font-size: 24px;
		padding: 5px 30px;
		cursor: pointer;
		text-decoration: none;
		text-align: center;
		color: #333333;
		transition: transform 0.2s;
		border-radius: 8px;
	}

	.tm-button:hover {
		transform: translateY(-2px);
		box-shadow: 1px 4px 11px -3px rgba(0, 200, 250, 0.67);
	}

	.tm-button:active {
		transform: translateY(0px);
		box-shadow: 1px 4px 11px -3px rgba(0, 200, 250, 0.47);
	}

	.active {
		transform: translateY(0px);
		box-shadow: 1px 4px 11px -3px rgba(0, 200, 250, 0.97);
	}
</style>
