<template>
  <div>Nuxt module playground!</div>
</template>

<script setup>
import { onMounted } from "vue";

const { $pusher } = useNuxtApp();

onMounted(() => {
  const pusher = $pusher.getInstance();
  const myChannel = pusher.subscribe("my-channel");
  myChannel.bind("my-event", function (data) {
    alert(JSON.stringify(data));
  });
});
</script>
