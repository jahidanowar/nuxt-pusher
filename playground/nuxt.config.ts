export default defineNuxtConfig({
  modules: ["../src/module"],
  pusher: {
    appId: "PUSHER_APP_ID",
    key: "PUSHER_KEY",
    secret: "PUSHER_SECRET",
    cluster: "PUSHER_CLUSTER",
  },
});
