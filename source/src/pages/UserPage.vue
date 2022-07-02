<template>
  <div data-testid="user-page">
    <ProfileCard
      v-if="!pendingApiCall && !failedResponse"
      :user="user"
    />
    <div
      v-if="pendingApiCall"
      class="alert alert-secondary text-center"
    >
      <TheSpinner size="normal" />
    </div>
    <div
      v-if="failedResponse"
      class="alert alert-danger text-center"
    >
      {{ failedResponse }}
    </div>
  </div>
</template>

<script>
import { getUserById } from '../api/apiCalls';
import ProfileCard from '../components/ProfileCard.vue';
import TheSpinner from '../components/TheSpinner.vue';

export default {
  name: 'UserPage',
  components: { ProfileCard, TheSpinner },
  data() {
    return {
      user: {},
      pendingApiCall: true,
      failedResponse: undefined,
    };
  },
  async mounted() {
    this.pendingApiCall = true;
    try {
      const response = await getUserById(this.$route.params.id);
      this.user = response.data;
    } catch (error) {
      this.failedResponse = error.response.data.message;
    }

    this.pendingApiCall = false;
  },
};
</script>
