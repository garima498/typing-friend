<!-- Dashboard -->
<script lang="ts">
	import Button from '../components/Button.svelte';
	import Progress from '../components/Progress.svelte';
	import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
	import Card from './../components/Card.svelte';
</script>

<div
	class="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-zinc-50 to-zinc-100 py-12 dark:from-zinc-900 dark:to-zinc-800"
>
	<ThemeSwitcher />
	<main class="text-center">
		<h1 class="mb-6 text-4xl font-bold tracking-tight dark:text-white sm:text-6xl">
			Master Typing with AI
		</h1>
		<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
			Improve your typing speed and accuracy with our AI-powered exercises. Get personalized
			lessons, real-time feedback, and track your progress over time.
		</p>
		<div class="mt-10 flex items-center justify-center gap-x-6">
			<Button asChild>
				<a
					href="/practice"
					class="rounded-lg bg-black px-4 py-2 font-medium text-white shadow transition duration-200 ease-in-out hover:bg-zinc-800"
				>
					Start Practicing
				</a>
			</Button>
		</div>
	</main>
	<div>
		<div class="container mx-auto py-10">
			<h1 class="mb-6 text-3xl font-bold">Your Typing Progress</h1>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<!-- Average WPM Card -->
				<Card className="p-6">
					<h3 class="text-sm font-medium">Average WPM</h3>
					<div class="text-2xl font-bold">58</div>
					<p class="text-muted-foreground text-xs">+20% from last week</p>
				</Card>
				<!-- Accuracy Card -->
				<Card className="p-6">
					<h3 class="text-sm font-medium">Accuracy</h3>
					<div class="text-2xl font-bold">96%</div>
					<p class="text-muted-foreground text-xs">+2% from last week</p>
				</Card>
				<!-- Lessons Completed Card -->
				<Card className="p-6">
					<h3 class="text-sm font-medium">Lessons Completed</h3>
					<div class="text-2xl font-bold">23</div>
					<p class="text-muted-foreground text-xs">+5 this week</p>
				</Card>
				<!-- Time Practiced Card -->
				<Card className="p-6">
					<h3 class="text-sm font-medium">Time Practiced</h3>
					<div class="text-2xl font-bold">5h 23m</div>
					<p class="text-muted-foreground text-xs">This week</p>
				</Card>
			</div>

			<div class="mt-6">
				<!-- Current Goal Card -->
				<Card className="p-4">
					<h3 class="text-lg font-medium">Current Goal</h3>
					<p>Reach 70 WPM with 98% accuracy</p>
					<Progress value={66} />
					<p class="text-muted-foreground mt-2 text-sm">66% completed</p>
				</Card>
			</div>
		</div>
	</div>
</div>
