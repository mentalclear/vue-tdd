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
            :disabled="isDisabled"
          >
            LogIn
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import TheInput from '../components/TheInput.vue';

export default {
  components: {
    TheInput,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    isDisabled() {
      return !(this.email && this.password);
    },
  },

};
</script>
