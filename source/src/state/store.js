import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isLoggedIn: false,
      userId: null,
    };
  },
  mutations: {
    loginSuccess(state, id) {
      state.isLoggedIn = true;
      state.userId = id;
    },
  },
});

export default store;
