<template>
  <v-card height="95vh" class="elevation-5">
    <v-toolbar dark color="primary">
      <v-toolbar-title
        >Shipment number {{ form.shipment_number }}</v-toolbar-title
      >
    </v-toolbar>
    <v-form
      :readonly="readonly"
      ref="form_update"
      v-model="validate"
      @submit.prevent="submit"
      v-on:keyup.enter="submit"
    >
      <v-card-text>
        <v-toolbar flat>
          <v-btn to="/"><v-icon>mdi-arrow-left</v-icon>Back to list</v-btn>
          <v-spacer></v-spacer>
          <div v-if="!readonly" class="warning--text">Edit mode</div>
          <v-spacer></v-spacer>
          <v-btn @click="editMode()" color="warning">Edit</v-btn></v-toolbar
        >
        <v-container style="max-height: 460px" class="overflow-y-auto">
          <v-text-field
            name="shipment_number"
            label="Shipment_number"
            type="text"
            :rules="shipmentNumberRules"
            v-model="form.shipment_number"
          ></v-text-field>
          <v-text-field
            name="loading_point"
            label="Loading point"
            type="text"
            :rules="loadingPointRules"
            v-model="form.loading_point"
          ></v-text-field>
          <v-text-field
            name="unloading_point"
            label="Unloading point"
            type="text"
            :rules="unloadingPointRules"
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
                :rules="loadDateRules"
              ></v-text-field>
            </template>
            <v-date-picker
              v-if="!readonly"
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
                :rules="unloadDateRules"
              ></v-text-field>
            </template>
            <v-date-picker
              v-if="!readonly"
              v-model="form.unload_date"
              :active-picker.sync="activePicker_unload_date"
              max="2050-01-01"
              min="1950-01-01"
              @change="menu_unload_date_save"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            name="tracking_number"
            label="Tracking number"
            type="text"
            :rules="trackingNumberRules"
            v-model="form.tracking_number"
          ></v-text-field>
          <v-text-field
            name="status"
            label="Status"
            type="text"
            :rules="statusRules"
            v-model="form.status"
          ></v-text-field>
          <items-component
            v-if="form.items"
            :oldItems="form.items"
            @update="updateItems"
            :readonly="readonly"
          />
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!readonly">
        <v-spacer></v-spacer>
        <v-btn text @click="editMode()">Cancel</v-btn>
        <v-btn type="submit" color="success">Save changes</v-btn>
        <v-btn color="error" @click="dialogDelete = !dialogDelete" class="mr-5"
          >Delete record</v-btn
        >
      </v-card-actions></v-form
    >
    <v-dialog v-model="dialogDelete" max-width="550px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this record?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogDelete = !dialogDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ItemsComponent from "@/components/Items.vue";

export default {
  name: "DetailPage",
  components: { ItemsComponent },
  data() {
    return {
      activePicker_load_date: null,
      activePicker_unload_date: null,
      menu_load_date: false,
      menu_unload_date: false,
      validate: false,
      readonly: true,
      dialogDelete: false,
      shipmentNumberRules: [(value) => !!value || "Enter value"],
      trackingNumberRules: [(value) => !!value || "Enter value"],
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
      form: {},
      defaultForm: {},
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
    editMode() {
      this.readonly = !this.readonly;
      if (this.readonly) {
        this.loadData();
      } else {
        this.defaultForm = structuredClone(this.form);
      }
    },
    updateItems(value) {
      this.form.items = value;
    },
    validateField() {
      this.$refs.form_update.validate();
    },
    async submit() {
      this.validateField();
      if (this.validate) {
        await this.$store
          .dispatch("API_PUT", { id: this.$route.params.id, form: this.form })
          .then(() => {
            this.editMode();
          });
      }
    },
    deleteConfirm() {
      this.$store.dispatch("API_DELETE", this.$route.params.id);
      this.$router.push({
        name: "HomePage",
      });
    },
    loadData() {
      this.$store
        .dispatch("API_RETRIEVE", this.$route.params.id)
        .then(() => (this.form = this.$store.getters.LOAD_SINGLE_DATA));
    },
  },
  created() {
    this.loadData();
  },
};
</script>
