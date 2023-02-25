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

<div class="flex">
	<div class="sidebar">
		<a href="/" class="tm-button active" id="training-btn" on:click={() => addActiveClass()}
			>Training</a
		>
		<a
			href="practice"
			class="tm-button"
			id="practice-btn"
			on:click={() => addActiveClass('practice')}>Practice</a
		>
		<a
			href="settings"
			class="tm-button"
			id="setting-btn"
			on:click={() => addActiveClass('settings')}>Settings</a
		>
	</div>
	<div class="p-2" />
	<div>
		<slot />
	</div>
</div>

<style>
	.p-2 {
		padding: 2rem;
	}
	.flex {
		display: flex;
	}
	.sidebar {
		top: 0;
		left: 0;
		width: 160px;
		height: 100%;
		padding-left: 20px;
		padding-top: 6%;
		transition: all 0.5s ease;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.tm-button {
		background-color: white;
		border: none;
		outline: none;
		box-shadow: -1px -1px 12px 2px rgb(216, 216, 216);
		font-size: 20px;
		padding: 5px 30px;
		cursor: pointer;
		text-decoration: none;
		text-align: center;
		color: #333333;
	}

	.tm-button:hover {
		box-shadow: -1px -1px 12px 2px rgba(124, 124, 124, 0.884);
		background-color: rgb(63, 63, 63);
		color: white;
	}

	.active {
		box-shadow: none;
		background-color: rgb(233, 233, 233);
	}
</style>
