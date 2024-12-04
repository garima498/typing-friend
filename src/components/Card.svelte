<script>
	export let className = '';
</script>

<div class="bg-card text-card-foreground rounded-lg border shadow-sm dark:text-white {className}">
	<slot />
</div>
