<template>
  <v-card height="95vh" class="elevation-5">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Shipment creation</v-toolbar-title> </v-toolbar
    ><v-form
      ref="form_create"
      v-model="form.validate"
      @submit.prevent="submit"
      v-on:keyup.enter="submit"
    >
      <v-card-text>
        <v-toolbar flat>
          <v-btn to="/"><v-icon>mdi-arrow-left</v-icon>Back to list</v-btn>
        </v-toolbar>
        <v-container style="max-height: 460px" class="overflow-y-auto">
          <v-text-field
            name="loading_point"
            label="Loading point"
            type="text"
            :rules="form.loadingPointRules"
            v-model="form.loading_point"
          ></v-text-field>
          <v-text-field
            name="unloading_point"
            label="Unloading point"
            type="text"
            :rules="form.unloadingPointRules"
            v-model="form.unloading_point"
          ></v-text-field>
          <v-menu
            ref="menu_load_date"
            v-model="menu_load_date"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.load_date"
                label="Load date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="form.loadDateRules"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.load_date"
              :active-picker.sync="activePicker_load_date"
              max="2050-01-01"
              min="1950-01-01"
              @change="menu_load_date_save"
            ></v-date-picker>
          </v-menu>
          <v-menu
            ref="menu_unload_date"
            v-model="menu_unload_date"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.unload_date"
                label="Unload_date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="form.unloadDateRules"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.unload_date"
              :active-picker.sync="activePicker_unload_date"
              max="2050-01-01"
              min="1950-01-01"
              @change="menu_unload_date_save"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            name="status"
            label="Status"
            type="text"
            :rules="form.statusRules"
            v-model="form.status"
          ></v-text-field>
          <items-component :oldItems="form.items" @update="updateItems" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn type="submit" class="mr-5" color="primary">Submit</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import ItemsComponent from "@/components/Items.vue";

export default {
  name: "CreatePage",
  components: { ItemsComponent },
  data() {
    return {
      activePicker_load_date: null,
      activePicker_unload_date: null,
      menu_load_date: false,
      menu_unload_date: false,
      form: {
        validate: false,
        loading_point: null,
        unloading_point: null,
        load_date: null,
        unload_date: null,
        status: "",
        items: [],
        loadingPointRules: [
          (value) => !!value || "Enter value",
          (value) =>
            (value && value.length <= 64) ||
            "Loading point must be less than 10 characters",
        ],
        unloadingPointRules: [
          (value) => !!value || "Enter value",
          (value) =>
            (value && value.length <= 64) ||
            "Unloading point must be less than 10 characters",
        ],
        loadDateRules: [(value) => !!value || "Enter value"],
        unloadDateRules: [(value) => !!value || "Enter value"],
        statusRules: [
          (value) => !!value || "Enter value",
          (value) =>
            (value && value.length <= 64) ||
            "Status must be less than 10 characters",
        ],
      },
    };
  },
  watch: {
    menu_load_date(val) {
      val && setTimeout(() => (this.activePicker_load_date = "YEAR"));
    },
    menu_unload_date(val) {
      val && setTimeout(() => (this.activePicker_unload_date = "YEAR"));
    },
  },
  methods: {
    menu_load_date_save(date) {
      this.$refs.menu_load_date.save(date);
    },
    menu_unload_date_save(date) {
      this.$refs.menu_unload_date.save(date);
    },
    updateItems(value) {
      console.log(value);
      this.form.items = value;
    },
    validateField() {
      this.$refs.form_create.validate();
    },
    async submit() {
      this.validateField();
      if (this.form.validate) {
        await this.$store
          .dispatch("API_POST", {
            loading_point: this.form.loading_point,
            unloading_point: this.form.unloading_point,
            load_date: this.form.load_date,
            unload_date: this.form.unload_date,
            status: this.form.status,
            items: this.form.items,
          })
          .then(() => {
            this.$router.replace(sessionStorage.getItem("redirectPath") || "/");
            sessionStorage.removeItem("redirectPath");
          });
      }
    },
  },
};
</script>
