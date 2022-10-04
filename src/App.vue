<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-overlay :value="loadingStatus">
      <v-progress-circular
        indeterminate
        size="70"
        width="7"
        color="teal"
      ></v-progress-circular>
    </v-overlay>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    loadingStatus() {
      return this.$store.getters.LOAD_LOADER;
    },
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
};
</script>
