<template>
  <v-layout justify-center align-center class="mt-4 pt-2">
    <div class="message">
      <p>
        Ошибка соединения с сервером
        <br />
        <small>Ведутся технические работы</small>
      </p>
      <br />
      <br />
      <v-btn large to="/"><v-icon>mdi-arrow-left</v-icon>ВЕРНУТЬСЯ</v-btn>
    </div>
  </v-layout>
</template>

<script>
export default {
  name: "ErrorPage",
  created() {
    this.$store.commit("SET_LOADER", true);
  },
  mounted() {
    console.log("check");
    this.$store.commit("SET_LOADER", false);
  },
};
</script>
