import { createStore } from 'vuex';
import storage from './storage';

const store = createStore({
  state() {
    return storage.getItem('auth');
  },
  mutations: {
    loginSuccess(state, id) {
      state.isLoggedIn = true;
      state.id = id;
    },
    reset(state, initialState) {
      state.isLoggedIn = false;
      delete state.id;
      if (initialState) {
        Object.keys(initialState).forEach((key) => {
          state[key] = initialState[key];
        });
      }
    },
  },
});

store.subscribe((mutation, state) => {
  storage.setItem('auth', state);
});

export const resetAuthState = () => {
  store.commit('reset', JSON.parse(localStorage.getItem('auth')));
};

export default store;
