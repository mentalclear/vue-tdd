<template>
  <span
    class="spinner-border"
    :class="size === 'small' ? 'spinner-border-sm' : ''"
    role="status"
  />
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small',
    },
  },
};
</script>
