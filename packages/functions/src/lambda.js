import { ApiHandler } from "sst/node/api";
import { Time } from "@day12-app/core/time";

export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      time: "Hey world"
    }),
  };
}

