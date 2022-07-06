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
            src="../assets/hoaxify.png"
            alt="Hoaxify logo"
            width="60"
          >
          Hoaxify
        </RouterLink>
        <ul class="navbar-nav">
          <RouterLink
            v-if="!$store.state.isLoggedIn"
            to="/signup"
            class="nav-link"
          >
            {{ $t('signUp') }}
          </RouterLink>
          <RouterLink
            v-if="!$store.state.isLoggedIn"
            to="/login"
            class="nav-link"
          >
            LogIn
          </RouterLink>
          <RouterLink
            v-if="$store.state.isLoggedIn"
            :to="`/user/${$store.state.id}`"
            class="nav-link"
          >
            My Profile
          </RouterLink>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
};
</script>
