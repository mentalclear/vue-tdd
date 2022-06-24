<template>
  <form>
    <h1>Sign Up</h1>
    <label for="username">
      User Name:
      <input
        id="username"
        v-model="username"
        type="text"
        placeholder="User Name"
      ></label>
    <label for="email">
      User Email:
      <input
        id="email"
        v-model="email"
        type="text"
        placeholder="E-Mail"
      ></label>
    <label for="password">
      Password:
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="password"
      ></label>
    <label for="repeat-password">
      Repeat Password:
      <input
        id="repeat-password"
        v-model="passwordRepeat"
        type="password"
        placeholder="repeat password"
      ></label>
    <button
      :disabled="isDisabled"
      @click.prevent="submit"
    >
      Sign Up
    </button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
    };
  },
  computed: {
    isDisabled() {
      return this.password && this.passwordRepeat
        ? this.password !== this.passwordRepeat
        : true;
    },
  },
  methods: {
    submit() {
      // const body = {

      // };
      axios.post('/api/1.0/users', {
        username: this.username,
        email: this.email,
        password: this.password,
      });

      // Need this for fetch tests:
      // fetch('/api/1.0/users', {
      //   method: 'POST',
      //   body: JSON.stringify(body),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
    },
  },
};
</script>
