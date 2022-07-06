<template>
  <button
    class="btn btn-primary"
    :disabled="disabled || apiProgress"
    @click.prevent="onClick"
  >
    <TheSpinner
      v-if="apiProgress"
    />
    <slot>Button</slot>
  </button>
</template>
<script>
import TheSpinner from './TheSpinner.vue';

export default {
  components: {
    TheSpinner,
  },
  props: {
    apiProgress: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click-custom-button'],
  methods: {
    onClick() {
      this.$emit('click-custom-button');
    },
  },
};
</script>
