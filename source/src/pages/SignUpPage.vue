<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form
      v-if="!signUpSuccess"
      class="card mb-5"
      data-testid="form-sign-up"
    >
      <div class="card-header">
        <h1 class="text-center">
          Sign Up
        </h1>
      </div>
      <div class="card-body">
        <TheInput
          id="username"
          v-model="username"
          label="User Name:"
          :help="errors.username"
          placeholder="User Name"
        />
        <TheInput
          id="email"
          v-model="email"
          label="User Email:"
          :help="errors.email"
          placeholder="E-Mail"
        />
        <TheInput
          id="password"
          v-model="password"
          label="Password:"
          type="password"
          :help="errors.password"
          placeholder="password"
        />
        <!-- <div class="mb-3">
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
        </div> -->
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
            :disabled="isDisabled || apiProgress"
            class="btn btn-primary"
            @click.prevent="submit"
          >
            <span
              v-if="apiProgress"
              class="spinner-border spinner-border-sm"
              role="status"
            />
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <div
      v-else
      class="alert alert-success mt-3"
      role="alert"
    >
      Please check your e-mail to activate your account
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TheInput from '../components/TheInput.vue';

export default {
  components: {
    TheInput,
  },
  data() {
    return {
      apiProgress: false,
      email: '',
      errors: {},
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
      this.apiProgress = true;
      const body = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      axios.post('/api/1.0/users', body)
        .then(() => {
          this.signUpSuccess = true;
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.errors = error.response.data.validationErrors;
          }
          this.apiProgress = false;
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
