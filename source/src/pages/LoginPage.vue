<template>
  <div
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
    data-testid="login-page"
  >
    <form class="card mb-5">
      <div class="card-header">
        <h1 class="text-center">
          Login
        </h1>
      </div>
      <div class="card-body">
        <TheInput
          id="email"
          v-model="email"
          label="E-Mail"
          placeholder="E-Mail"
        />
        <TheInput
          id="password"
          v-model="password"
          label="Password"
          type="password"
          placeholder="password"
        />
        <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="isDisabled || apiProgress"
            @click.prevent="submit"
          >
            <TheSpinner
              v-if="apiProgress"
            />
            LogIn
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
    };
  },
  computed: {
    isDisabled() {
      return !(this.email && this.password);
    },
  },
  methods: {
    async submit() {
      try {
        this.apiProgress = true;
        const creds = {
          email: this.email,
          password: this.password,
        };
        await login(creds);
      } catch (error) {
        //
        this.apiProgress = false;
      }
    },
  },
};
</script>
