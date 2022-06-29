<template>
  <div class="shadow-sm bg-light">
    <nav class="navbar navbar-expand-lg navbar-light container">
      <div class="container-fluid">
        <a
          href="/"
          title="Home"
          class="navbar-brand"
          @click.prevent="onClickLink"
        ><img
          src="./assets/hoaxify.png"
          alt="Hoaxify logo"
          width="60"
        >
          Hoaxify</a>
        <ul class="navbar-nav">
          <a
            href="/signup"
            class="nav-link"
            @click.prevent="onClickLink"
          >{{ $t('signUp') }} </a>
          <a
            href="/login"
            class="nav-link"
            @click.prevent="onClickLink"
          >LogIn </a>
        </ul>
      </div>
    </nav>
  </div>
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
