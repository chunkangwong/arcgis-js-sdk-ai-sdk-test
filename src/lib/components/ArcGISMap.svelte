<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { type ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
  import type { UseChatToolsMessage } from "../../routes/api/chat/+server";

  let { chat }: { chat: Chat<UseChatToolsMessage> } = $props();

  let arcgisMap: ArcgisMap;

  $effect(() => {
    if (chat.lastMessage?.role != "assistant") return;

    for (const part of chat.lastMessage.parts) {
      if (!part.type.startsWith("tool-map")) continue;

      if (part.type === "tool-mapZoomTo" && part.state == "output-available") {
        arcgisMap.view.goTo({
          center: [part.output.lat, part.output.lon],
          zoom: part.output.zoom,
        });
      }
    }
  });

  const handleViewReady = () => {
    console.log(arcgisMap.view);
  };
</script>

<arcgis-map
  bind:this={arcgisMap}
  onarcgisViewReadyChange={handleViewReady}
  center="103.7983742,1.3476695"
  zoom="12"
  basemap="topo-vector"
></arcgis-map>

<style>
  arcgis-map {
    height: 100%;
  }
</style>
