<template>
  <div>Nuxt module playground!</div>
</template>

<script setup>
import { useNuxtApp } from "#app";
import { onMounted } from "vue";

onMounted(() => {
  const { $pusher } = useNuxtApp();
  const myChannel = $pusher.subscribe("my-channel");
  myChannel.bind("my-event", function (data) {
    alert(JSON.stringify(data));
  });
});
</script>
