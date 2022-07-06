/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { createStore } from 'vuex';
import storage from './storage';

const store = createStore({
  state() {
    return storage.getItem('auth');
  },
  mutations: {
    loginSuccess(state, data) {
      state.isLoggedIn = true;
      state.id = data.id;
      state.username = data.username;
      state.image = data.image;
    },
    reset(state, initialState) {
      state.isLoggedIn = false;
      delete state.id;
      // if (initialState) {
      //   Object.keys(initialState).forEach((key) => {
      //     state[key] = initialState[key];
      //   });
      // }
      for (const key in initialState) {
        state[key] = initialState[key];
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
