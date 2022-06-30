<template>
  <div
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
    data-testid="signup-page"
  >
    <form
      v-if="!signUpSuccess"
      class="card mb-5"
      data-testid="form-sign-up"
    >
      <div class="card-header">
        <h1 class="text-center">
          {{ $t('signUp') }}
        </h1>
      </div>
      <div class="card-body">
        <TheInput
          id="username"
          v-model="username"
          :label="$t('username')"
          :help="errors.username"
          placeholder="User Name"
        />
        <TheInput
          id="email"
          v-model="email"
          :label="$t('email')"
          :help="errors.email"
          placeholder="E-Mail"
        />
        <TheInput
          id="password"
          v-model="password"
          :label="$t('password')"
          type="password"
          :help="errors.password"
          placeholder="password"
        />
        <TheInput
          id="repeat-password"
          v-model="passwordRepeat"
          :label="$t('passwordRepeat')"
          type="password"
          placeholder="repeat password"
          :help="hasPasswordMismatch ? $t('passwordMismatchValidation') : ''"
        />
        <div class="text-center">
          <button
            :disabled="isDisabled || apiProgress"
            class="btn btn-primary"
            @click.prevent="submit"
          >
            <TheSpinner
              v-if="apiProgress"
            />
            {{ $t('signUp') }}
          </button>
        </div>
      </div>
    </form>
    <div
      v-else
      class="alert alert-success mt-3"
      role="alert"
    >
      {{ $t('accountActivationNotification') }}
    </div>
  </div>
</template>

<script>
import { signUp } from '../api/apiCalls';
import TheInput from '../components/TheInput.vue';
import TheSpinner from '../components/TheSpinner.vue';

export default {
  components: {
    TheInput,
    TheSpinner,
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
    hasPasswordMismatch() {
      return this.password !== this.passwordRepeat;
    },
  },
  watch: {
    username() {
      delete this.errors.username;
    },
    email() {
      delete this.errors.email;
    },
    password() {
      delete this.errors.password;
    },
  },
  methods: {
    async submit() {
      this.apiProgress = true;
      const body = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      try {
        await signUp(body);
        this.signUpSuccess = true;
      } catch (error) {
        if (error.response.status === 400) {
          this.errors = error.response.data.validationErrors;
        }
        this.apiProgress = false;
      }

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
