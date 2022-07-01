<template>
  <img
    src="../assets/profile.png"
    alt="profile image"
    width="30"
    class="shadow-sm"
  >
  {{ user.username }}
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
};

</script>
