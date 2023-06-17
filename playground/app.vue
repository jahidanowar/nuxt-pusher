<template>
  <div>Nuxt module playground!</div>
</template>

<script setup>
import { onMounted } from "./.nuxt/imports";

// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello
// Hello

onMounted(() => {
  const { $pusher } = useNuxtApp();
  const myChannel = $pusher.subscribe("my-channel");
  myChannel.bind("my-event", function (data) {
    alert(JSON.stringify(data));
  });
});
</script>
