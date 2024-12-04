<script>
  export let value = 0;
  export let className = '';
</script>

<div class="relative h-4 w-full overflow-hidden rounded-full bg-secondary {className}">
  <div class="h-full w-full flex-1 bg-primary transition-all" style="transform: translateX(-{100 - value}%)"></div>
</div>
