import { defineNuxtPlugin } from "#app";
import { usePusher } from "../runtime/composables/usePusher";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      pusher: usePusher(),
    },
  };
});
