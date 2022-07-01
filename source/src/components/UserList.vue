<template>
  <div class="card mb-3">
    <div class="card-header text-center">
      <h3>Users</h3>
    </div>
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
    <div class="card-footer text-center">
      <button
        v-show="page.page > 0 && !pendingApiCall"
        class="btn btn-outline-secondary btn-sm float-start"
        @click="loadData(page.page - 1)"
      >
        &lt; previous
      </button>
      <button
        v-show="page.totalPages > page.page + 1 && !pendingApiCall"
        class="btn btn-outline-secondary btn-sm float-end"
        @click="loadData(page.page + 1)"
      >
        next &gt;
      </button>
      <TheSpinner
        v-show="pendingApiCall"
        size="normal"
      />
    </div>
  </div>
</template>

<script>
import { loadUsers } from '../api/apiCalls';
import UserListItem from './UserListItem.vue';
import TheSpinner from './TheSpinner.vue';

export default {
  components: {
    UserListItem,
    TheSpinner,
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
