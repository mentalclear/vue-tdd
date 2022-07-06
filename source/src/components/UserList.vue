<template>
  <TheCard>
    <template #header>
      <h3> {{ $t('users') }} </h3>
    </template>
    <template #default>
      <ul class="list-group list-group-flush">
        <li
          v-for="user in page.content"
          :key="user.id"
          class="list-group-item list-group-item-action"
          @click="$router.push(`/user/${user.id}`)"
          @keydown="$router.push(`/user/${user.id}`)"
        >
          <UserListItem :user="user" />
        </li>
      </ul>
    </template>
    <template #footer>
      <button
        v-show="page.page > 0 && !pendingApiCall"
        class="btn btn-outline-secondary btn-sm float-start"
        @click="loadData(page.page - 1)"
      >
        {{ $t('previousPage') }}
      </button>
      <button
        v-show="page.totalPages > page.page + 1 && !pendingApiCall"
        class="btn btn-outline-secondary btn-sm float-end"
        @click="loadData(page.page + 1)"
      >
        {{ $t('nextPage') }}
      </button>
      <TheSpinner
        v-show="pendingApiCall"
        size="normal"
      />
    </template>
  </TheCard>
</template>

<script>
import { loadUsers } from '../api/apiCalls';
import TheCard from './TheCard.vue';
import TheSpinner from './TheSpinner.vue';
import UserListItem from './UserListItem.vue';

export default {
  components: {
    TheCard,
    TheSpinner,
    UserListItem,
  },
  data() {
    return {
      page: {
        content: [],
        page: 0,
        size: 0,
        totalPages: 0,
      },
      pendingApiCall: true,
    };
  },
  async mounted() {
    this.loadData();
  },
  methods: {
    async loadData(pageIndex) {
      this.pendingApiCall = true;
      const response = await loadUsers(pageIndex);
      this.page = response.data;
      this.pendingApiCall = false;
    },
  },

};
</script>

<style scoped>
li {
  cursor: pointer;
}
</style>
