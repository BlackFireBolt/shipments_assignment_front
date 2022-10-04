<template>
    <section>
      <v-container> <router-view></router-view></v-container>
    </section>
  </template>
  
  <script>
  export default {
    name: "MainTemplate",
    created() {
      this.$store.commit("SET_LOADER", true);
    },
  };
  </script>
  