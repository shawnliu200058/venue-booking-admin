<template>
  <div id="app">
    <keep-alive>
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    key() {
      return this.$route.path + Math.random();
    },
  },
};
</script>
