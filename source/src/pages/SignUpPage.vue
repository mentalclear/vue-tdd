<template>
  <h1>Sign Up</h1>
  <label for="username">
    User Name:
    <input
      id="username"
      type="text"
      placeholder="User Name"
    ></label>
  <label for="email">
    User Email:
    <input
      id="email"
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
  <button :disabled="isDisabled">
    Sign Up
  </button>
</template>

<script>
export default {
  data() {
    return {
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
};
</script>
