//@ts-ignore
import { serverPusher } from "#nuxt-pusher";

export default eventHandler(() => {
  const pusher = serverPusher();

  pusher.trigger("my-channel", "my-event", {
    message: "hello world",
  });

  return {
    status: 200,
    body: {
      message: "Hello world!",
    },
  };
});
