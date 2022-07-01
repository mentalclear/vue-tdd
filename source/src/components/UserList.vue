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
    <div class="card-footer">
      <button
        v-if="page.page > 0"
        class="btn btn-outline-secondary btn-sm"
        @click="loadData(page.page - 1)"
      >
        &lt; previous
      </button>
      <button
        v-if="page.totalPages > page.page + 1"
        class="btn btn-outline-secondary btn-sm float-end"
        @click="loadData(page.page + 1)"
      >
        next &gt;
      </button>
    </div>
  </div>
</template>

<script>
import { loadUsers } from '../api/apiCalls';
import UserListItem from './UserListItem.vue';

export default {
  components: {
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
    };
  },
  async mounted() {
    this.loadData();
  },
  methods: {
    async loadData(pageIndex) {
      const response = await loadUsers(pageIndex);
      this.page = response.data;
    },
  },

};
</script>

<style scoped>
li {
  cursor: pointer;
}
</style>
