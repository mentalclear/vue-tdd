<template>
  <div
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
    data-testid="login-page"
  >
    <form class="mb-5">
      <TheCard>
        <template #header>
          <h1>
            {{ $t('login') }}
          </h1>
        </template>
        <template #body>
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
            <TheProgressButton
              :api-progress="apiProgress"
              :disabled="isDisabled"
              @click-custom-button="submit"
            >
              {{ $t('login') }}
            </TheProgressButton>
          </div>
        </template>
      </TheCard>
    </form>
  </div>
</template>

<script>
import TheCard from '../components/TheCard.vue';
import TheProgressButton from '../components/TheProgressButton.vue';
import TheInput from '../components/TheInput.vue';
import { login } from '../api/apiCalls';

export default {
  name: 'LoginPage',
  components: {
    TheCard,
    TheProgressButton,
    TheInput,
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
        const response = await login(creds);
        this.$router.replace('/');
        // Passing user's id using response data
        this.$store.commit('loginSuccess', response.data.id);
      } catch (error) {
        this.failMessage = error.response.data.message;
      }
      this.apiProgress = false;
    },
  },
};
</script>
