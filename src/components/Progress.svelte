<script>
	export let value = 0;
	export let classes = '';
</script>

<div class="bg-secondary relative h-4 w-full overflow-hidden rounded-full {classes}">
	<div
		class="bg-primary h-full w-full flex-1 transition-all"
		style="transform: translateX(-{100 - value}%)"
	></div>
</div>
