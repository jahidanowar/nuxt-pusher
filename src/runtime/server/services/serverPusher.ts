import Pusher from "pusher";
//@ts-ignore
import { useRuntimeConfig } from "#imports";

export function serverPusher(): Pusher {
  const {
    pusher: { pusherSecret, pusherAppId, pusherUseTLS },
    public: { pusherKey, pusherCluster },
  } = useRuntimeConfig();

  if (!pusherSecret) {
    throw new Error("PUSHER_SECRET is not defined");
  }

  if (!pusherAppId) {
    throw new Error("PUSHER_APP_ID is not defined");
  }

  if (!pusherKey) {
    throw new Error("PUSHER_KEY is not defined");
  }

  if (!pusherCluster) {
    throw new Error("PUSHER_CLUSTER is not defined");
  }

  const pusher = new Pusher({
    appId: pusherAppId,
    key: pusherKey,
    secret: pusherSecret,
    cluster: pusherCluster,
    useTLS: pusherUseTLS || true,
  });
  return pusher;
}
