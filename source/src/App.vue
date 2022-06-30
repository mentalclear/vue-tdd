<template>
  <div class="shadow-sm bg-light mb-3">
    <nav class="navbar navbar-expand-lg navbar-light container">
      <div class="container-fluid">
        <RouterLink
          to="/"
          title="Home"
          class="navbar-brand"
        >
          <img
            src="./assets/hoaxify.png"
            alt="Hoaxify logo"
            width="60"
          >
          Hoaxify
        </RouterLink>
        <ul class="navbar-nav">
          <RouterLink
            to="/signup"
            class="nav-link"
          >
            {{ $t('signUp') }}
          </RouterLink>
          <RouterLink
            to="/login"
            class="nav-link"
          >
            LogIn
          </RouterLink>
        </ul>
      </div>
    </nav>
  </div>
  <div class="container">
    <RouterView />
    <TheLanguageSelector />
  </div>
</template>

<script>
import TheLanguageSelector from './components/TheLanguageSelector.vue';

export default {
  name: 'App',
  components: {
    TheLanguageSelector,
  },
  data() {
    return {
      path: window.location.pathname,
    };
  },
  methods: {
    onClickLink(event) {
      this.path = event.currentTarget.attributes.href.value;
      window.history.pushState({}, '', this.path);
    },
  },
};
</script>
