<template>
  <div class="container">
    <a
      href="/"
      title="Home"
      @click.prevent="onClickLink"
    >Hoaxify</a>
    <a
      href="/signup"
      @click.prevent="onClickLink"
    >{{ $t('signUp') }} </a>
    <a
      href="/login"
      @click.prevent="onClickLink"
    >LogIn </a>
    <HomePage v-if="path === '/'" />
    <SignUpPage v-else-if="path === '/signup'" />
    <LoginPage v-else-if="path === '/login'" />
    <UserPage v-else-if="path.startsWith('/user/')" />
    <TheLanguageSelector />
  </div>
</template>

<script>
import HomePage from './pages/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import SignUpPage from './pages/SignUpPage.vue';
import UserPage from './pages/UserPage.vue';
import TheLanguageSelector from './components/TheLanguageSelector.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    LoginPage,
    SignUpPage,
    UserPage,
    TheLanguageSelector,

  },
  data() {
    return {
      path: window.location.pathname,
    };
  },
  methods: {
    onClickLink(event) {
      this.path = event.target.attributes.href.value;
      window.history.pushState({}, '', this.path);
    },
  },
};
</script>
