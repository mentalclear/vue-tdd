<template>
  <div class="container">
    <HomePage v-if="path === '/'" />
    <SignUpPage v-else-if="path === '/signup'" />
    <TheLanguageSelector />
  </div>
</template>

<script>
import HomePage from './pages/HomePage.vue';
import SignUpPage from './pages/SignUpPage.vue';
import TheLanguageSelector from './components/TheLanguageSelector.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    SignUpPage,
    TheLanguageSelector,
  },
  computed: {
    path() {
      return window.location.pathname;
    },
  },
};
</script>
