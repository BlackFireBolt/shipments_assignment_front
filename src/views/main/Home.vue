<template>
  <v-card height="95vh" class="elevation-5">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Shipment information</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-btn class="mb-5" to="create/"><v-icon>mdi-plus</v-icon>Create new order</v-btn>
      <v-container style="max-height: 500px" class="overflow-y-auto">
        <v-card
          v-for="(item, i) in loadData"
          v-bind:key="i"
          outlined
          class="my-2"
        >
          <v-card-title>
            Shipment {{ item.shipment_number }}<v-spacer></v-spacer
            ><v-btn
              @click="
                $router.push({
                  name: 'DetailPage',
                  params: {
                    id: item.id,
                  },
                })
              "
              >More</v-btn
            >
          </v-card-title>
          <v-card-subtitle>{{ item.status }}</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col md="6">
                <p>Loading point --- {{ item.loading_point }}</p>
                <p>Load date --- {{ item.load_date }}</p></v-col
              >
              <v-col md="6">
                <p>Unloading point --- {{ item.unloading_point }}</p>
                <p>Unload date --- {{ item.unload_date }}</p></v-col
              >
            </v-row>
            <p>Tracking number --- {{ item.tracking_number }}</p>
          </v-card-text>
        </v-card>
      </v-container>

      <div class="text-center align-end">
        <v-pagination
          v-model="page"
          :length="loadCount"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
          @input="changePage"
        ></v-pagination>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      page: 1,
      input_string: "",
    };
  },
  computed: {
    loadData() {
      return this.$store.getters.LOAD_DATA;
    },
    loadCount() {
      let count = this.$store.getters.LOAD_COUNT;
      if (count % 10 == 0) {
        return count / 10;
      } else {
        return Math.floor(count / 10) + 1;
      }
    },
  },
  methods: {
    changePage() {
      this.$store.dispatch("API_GET", this.page-1);
    },
  },
  mounted() {
    this.$store.dispatch("API_GET");
  },
};
</script>
