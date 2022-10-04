<template>
  <v-container>
    <v-data-table
      dense
      :items="items"
      :headers="headers"
      item-key="id"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus',
      }"
    >
      <template v-slot:top
        ><v-toolbar flat>
          <v-toolbar-title>Items</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!readonly"
            color="primary"
            dark
            class="mb-2"
            @click="dialog = !dialog"
          >
            New Item
          </v-btn>
        </v-toolbar></template
      >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small :disabled="readonly" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small :disabled="readonly" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <p class="mt-4">Empty list</p>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card
        ><v-form
          ref="form_item"
          v-model="validate"
          @submit.prevent="save"
          v-on:keyup.enter="save"
        >
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-text-field
                v-model="editedItem.name"
                type="text"
                label="Name"
                :rules="nameRules"
              ></v-text-field>
              <v-textarea
                v-model="editedItem.description"
                label="Description"
                auto-grow
                :rules="descriptionRules"
              ></v-textarea>

              <v-text-field
                v-model="editedItem.quantity"
                label="Quantity"
                :rules="quantityRules"
              ></v-text-field>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
          </v-card-actions></v-form
        >
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "ItemsComponent",
  data() {
    return {
      validate: false,
      options: {},
      dialog: false,
      dialogDelete: false,
      editedIndex: null,
      nameRules: [
        (value) => !!value || "Enter value",
        (value) =>
          (value && value.length <= 64) ||
          "Name must be less than 10 characters",
      ],
      descriptionRules: [(value) => !!value || "Enter value"],
      quantityRules: [
        (value) => !!value || "Enter value",
        (value) =>
          Number.isInteger(Number(value)) ||
          "The value must be an integer number",
      ],

      editedItem: {
        name: null,
        quantity: null,
        description: null,
      },
      defaultItem: {
        name: null,
        quantity: null,
        description: null,
      },
      headers: [
        { text: "Quantity", value: "quantity", aligh: "start" },
        { text: "Description", value: "description" },

        { text: "Actions", value: "actions", sortable: false },
      ],
      items: this.oldItems,
    };
  },
  props: {
    readonly: { type: Boolean, default: false },
    oldItems: { type: Array, default: () => [] },
    length: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  computed: {
    formTitle() {
      return this.editedIndex === null ? "New Item" : "Edit Item";
    },
  },
  watch: {
    readonly() {
      this.items = structuredClone(this.oldItems);
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    validateField() {
      this.$refs.form_item.validate();
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      if (this.editedItem.id) {
        this.$store
          .dispatch("API_ITEM_DELETE", this.editedIndex)
          .then(() => this.items.splice(this.editedIndex, 1));
      } else {
        this.items.splice(this.editedIndex, 1);
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = null;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = null;
      });
    },

    save() {
      this.validateField();
      if (this.validate) {
        if (this.editedIndex !== null) {
          Object.assign(this.items[this.editedIndex], this.editedItem);
        } else {
          this.items.push(this.editedItem);
        }
        this.$emit("update", this.items);
        this.close();
      }
    },
  },
  mounted() {},
};
</script>
