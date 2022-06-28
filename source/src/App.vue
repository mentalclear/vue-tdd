<template>
  <div class="container">
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
  computed: {
    path() {
      return window.location.pathname;
    },
  },
};
</script>
