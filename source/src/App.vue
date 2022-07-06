<template>
  <TheNavBar />
  <div class="container">
    <RouterView />
    <TheLanguageSelector />
  </div>
</template>

<script>
import TheLanguageSelector from './components/TheLanguageSelector.vue';
import TheNavBar from './components/TheNavBar.vue';

export default {
  name: 'App',
  components: {
    TheLanguageSelector,
    TheNavBar,
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
