import Pusher from "pusher-js";
import { useRuntimeConfig, createError } from "#app";
import { isProduction } from "./../helper";

export function usePusher(): Pusher {
  const config: any = useRuntimeConfig();

  if (!config.public?.pusherKey) {
    throw createError("PUSHER_KEY is not defined");
  }

  if (!config.public?.pusherCluster) {
    throw createError("PUSHER_CLUSTER is not defined");
  }

  const pusher = new Pusher(config.public.pusherKey, {
    cluster: config.public?.pusherCluster,
  });

  pusher.connection.bind("connected", () => {
    !isProduction && console.log("Pusher connected");
  });

  pusher.connection.bind("disconnected", () => {
    !isProduction && console.warn("Pusher disconnected");
  });

  pusher.connection.bind("error", (err: any) => {
    !isProduction && console.error("Pusher error", err);
  });

  return pusher;
}
