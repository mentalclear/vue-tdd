<template>
  <div class="mb-3">
    <label
      :for="id"
      class="form-label"
    >
      {{ label }}
      <input
        :id="id"
        type="text"
        placeholder="User Name"
        class="form-control"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <span>{{ help }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    help: {
      type: String,
      default: '',
    },
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
};
</script>

<style>
</style>
