<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card mb-5">
      <div class="card-header">
        <h1 class="text-center">
          Sign Up
        </h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label
            for="username"
            class="form-label"
          >
            User Name:
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="User Name"
              class="form-control"
            ></label>
        </div>
        <div class="mb-3">
          <label
            for="email"
            class="form-label"
          >
            User Email:
            <input
              id="email"
              v-model="email"
              type="text"
              placeholder="E-Mail"
              class="form-control"
            ></label>
        </div>
        <div class="mb-3">
          <label
            for="password"
            class="form-label"
          >
            Password:
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="password"
              class="form-control"
            ></label>
        </div>
        <div class="mb-3">
          <label
            for="repeat-password"
            class="form-label"
          >
            Repeat Password:
            <input
              id="repeat-password"
              v-model="passwordRepeat"
              type="password"
              placeholder="repeat password"
              class="form-control"
            ></label>
        </div>
        <div class="text-center">
          <button
            :disabled="isDisabled"
            class="btn btn-primary"
            @click.prevent="submit"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
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
