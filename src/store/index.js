import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loader: true,
    data: [],
    next_page: null,
    previous_page: null,
    count: 0,
    single_data: {},
  },
  getters: {
    LOAD_LOADER: (state) => {
      return state.loader;
    },
    LOAD_DATA: (state) => {
      return state.data;
    },
    LOAD_NEXT_PAGE: (state) => {
      return state.next_page;
    },
    LOAD_PREVIUS_PAGE: (state) => {
      return state.previous_page;
    },
    LOAD_COUNT: (state) => {
      return state.count;
    },
    LOAD_SINGLE_DATA: (state) => {
      return state.single_data;
    },
  },
  mutations: {
    SET_LOADER: (state, payload) => {
      state.loader = payload;
    },
    SET_DATA: (state, payload) => {
      state.data = payload.results;
      state.next_page = payload.next;
      state.previous_page = payload.previous;
      state.count = payload.count;
    },
    SET_SINGLE_DATA: (state, payload) => {
      state.single_data = payload;
    },
  },
  actions: {
    API_GET: async (context, page) => {
      await axios
        .get("http://127.0.0.1:8000/api/?limit=10&offset=" + page * 10, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          context.commit("SET_DATA", response.data);
        });
    },
    API_RETRIEVE: async (context, payload) => {
      await axios
        .get(
          "http://127.0.0.1:8000/api/" + payload + "/",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          context.commit("SET_SINGLE_DATA", response.data);
        });
    },
    API_POST: async (context, payload) => {
      await axios.post("http://127.0.0.1:8000/api/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    API_PUT: async (context, payload) => {
      await axios
        .put("http://127.0.0.1:8000/api/" + payload.id + "/", payload.form, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          context.commit("SET_SINGLE_DATA", response.data);
        });
    },
    API_DELETE: async (context, payload) => {
      await axios.delete("http://127.0.0.1:8000/api/" + payload + "/", {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    API_ITEM_DELETE: async (context, payload) => {
      await axios.delete("http://127.0.0.1:8000/api/item/" + payload + "/", {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
  modules: {},
});
