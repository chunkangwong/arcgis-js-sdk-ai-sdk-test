<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { createAIContext } from "@ai-sdk/svelte";

  let { children } = $props();

  createAIContext();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
