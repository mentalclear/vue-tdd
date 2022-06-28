<template>
  <div class="container">
    <SignUpPage />
    <TheLanguageSelector />
  </div>
</template>

<script>
import SignUpPage from './pages/SignUpPage.vue';
import TheLanguageSelector from './components/TheLanguageSelector.vue';

export default {
  name: 'App',
  components: {
    SignUpPage,
    TheLanguageSelector,
  },
};
</script>
