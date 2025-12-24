<script lang="ts">
  import ArcGISMap from "$lib/components/ArcGISMap.svelte";
  import { Chat } from "@ai-sdk/svelte";
  import "@arcgis/map-components/components/arcgis-map";

  import { type UseChatToolsMessage } from "./api/chat/+server";

  let input = $state("");

  const chat = new Chat<UseChatToolsMessage>({});

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    chat.sendMessage({ text: input });
    input = "";
  }
</script>

<main>
  <div class="chat-container">
    <ul>
      {#each chat.messages as message, messageIndex (messageIndex)}
        <li>
          <div>{message.role}</div>
          <div>
            {#each message.parts as part, partIndex (partIndex)}
              {#if part.type === "text"}
                <div>{part.text}</div>
              {:else if part.type.startsWith("tool-")}
                <pre>{JSON.stringify(part, null, 2)}</pre>
              {/if}
            {/each}
          </div>
        </li>
      {/each}
    </ul>
    <form onsubmit={handleSubmit}>
      <input bind:value={input} />
      <button type="submit">Send</button>
    </form>
  </div>
  <ArcGISMap {chat} />
</main>

<style>
  main {
    display: flex;
    height: 100%;
  }

  div.chat-container {
    width: 30em;
    overflow: auto;
  }
</style>
