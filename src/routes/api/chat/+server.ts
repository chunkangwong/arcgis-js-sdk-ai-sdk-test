import {
  convertToModelMessages,
  createGateway,
  stepCountIs,
  streamText,
  tool,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { AI_GATEWAY_API_KEY } from "$env/static/private";

const gateway = createGateway({
  apiKey: AI_GATEWAY_API_KEY,
});

const tools = {
  weather: tool({
    description: "Get the weather in a location (fahrenheit)",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32);
      return {
        location,
        temperature,
      };
    },
  }),
  convertFahrenheitToCelsius: tool({
    description: "Convert a temperature in fahrenheit to celsius",
    inputSchema: z.object({
      temperature: z
        .number()
        .describe("The temperature in fahrenheit to convert"),
    }),
    execute: async ({ temperature }) => {
      const celsius = Math.round((temperature - 32) * (5 / 9));
      return {
        celsius,
      };
    },
  }),
  geocode: tool({
    description: "Geocode the input location to latitude and longitude",
    inputSchema: z.object({
      location: z.string().describe("The location to be geocoded"),
    }),
    execute: async ({ location }) => {
      return {
        location,
        lat: 103.7983742,
        lon: 1.3476695,
      };
    },
  }),
  mapZoomTo: tool({
    description: "Zoom to map",
    inputSchema: z.object({
      lat: z.number().describe("Latitude of the point to zoom to"),
      lon: z.number().describe("Longitude of the point to zoom to"),
      zoom: z.number().describe("Zoom level").default(12),
    }),
    execute: async ({ lat, lon, zoom }) => {
      return {
        zoom,
        lat: 103.7983742,
        lon: 1.3476695,
      };
    },
  }),
} as const;

export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: gateway("openai/gpt-4o"),
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });

  return result.toUIMessageStreamResponse();
}

export type UseChatToolsMessage = UIMessage<
  never,
  UIDataTypes,
  InferUITools<typeof tools>
>;
