<template>
  <div
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
    data-testid="login-page"
  >
    <form class="card mb-5">
      <div class="card-header">
        <h1 class="text-center">
          {{ $t('login') }}
        </h1>
      </div>
      <div class="card-body">
        <TheInput
          id="email"
          v-model="email"
          :label="$t('email')"
          placeholder="E-Mail"
        />
        <TheInput
          id="password"
          v-model="password"
          :label="$t('password')"
          type="password"
          placeholder="password"
        />
        <div
          v-if="failMessage"
          class="alert alert-danger text-center"
        >
          {{ failMessage }}
        </div>
        <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="isDisabled || apiProgress"
            @click.prevent="submit"
          >
            <TheSpinner
              v-if="apiProgress"
            />
            {{ $t('login') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import TheInput from '../components/TheInput.vue';
import TheSpinner from '../components/TheSpinner.vue';
import { login } from '../api/apiCalls';

export default {
  components: {
    TheInput,
    TheSpinner,
  },
  data() {
    return {
      email: '',
      password: '',
      apiProgress: false,
      failMessage: undefined,
    };
  },
  computed: {
    isDisabled() {
      return !(this.email && this.password);
    },
  },
  watch: {
    email() {
      this.failMessage = undefined;
    },
    password() {
      this.failMessage = undefined;
    },
  },
  methods: {
    async submit() {
      this.apiProgress = true;
      try {
        const creds = {
          email: this.email,
          password: this.password,
        };
        await login(creds);
      } catch (error) {
        this.failMessage = error.response.data.message;
      }
      this.apiProgress = false;
    },
  },
};
</script>
