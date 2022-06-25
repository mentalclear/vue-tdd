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
            :disabled="isDisabled || disabled"
            class="btn btn-primary"
            @click.prevent="submit"
          >
            <span
              v-if="disabled"
              class="spinner-border spinner-border-sm"
              role="status"
            />
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <div
      v-if="signUpSuccess"
      class="alert alert-success"
      role="alert"
    >
      Please check your e-mail to activate your account
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      apiProgress: false,
      disabled: false,
      email: '',
      password: '',
      passwordRepeat: '',
      signUpSuccess: false,
      username: '',
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
      this.disabled = true;
      // this.apiProgress = true; // Need another? Use disabled above!
      const body = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      axios.post('/api/1.0/users', body)
        .then(() => {
          this.signUpSuccess = true;
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
