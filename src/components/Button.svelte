<script>
  export let variant = "default"; // Button variant: "default" or "outline"
  export let asChild = false; // Determines if the button wraps a child element
</script>

{#if asChild}
  <slot />
{:else}
  <button
    class={`${
      variant === "outline"
        ? "border border-black text-black bg-white hover:bg-gray-100"
        : "bg-black text-white hover:bg-gray-800"
    } px-4 py-2 rounded-lg font-medium shadow transition duration-200 ease-in-out`}
  >
    <slot />
  </button>
{/if}
