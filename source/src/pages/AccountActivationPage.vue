<template>
  <div data-testid="activation-page">
    <div
      v-if="success"
      class="alert alert-success mt-3"
    >
      Account is activated
    </div>
    <div
      v-if="fail"
      class="alert alert-danger mt-3"
    >
      Activation failure
    </div>
    <TheSpinner
      v-if="apiProgress"
      size="normal"
    />
  </div>
</template>

<script>
import { activate } from '../api/apiCalls';
import TheSpinner from '../components/TheSpinner.vue';

export default {
  components: {
    TheSpinner,
  },
  data() {
    return {
      success: false,
      fail: false,
      apiProgress: false,
    };
  },
  async mounted() {
    this.apiProgress = true;
    try {
      await activate(this.$route.params.token);
      this.success = true;
    } catch (error) {
      this.fail = true;
    }
    this.apiProgress = false;
  },

};
</script>
