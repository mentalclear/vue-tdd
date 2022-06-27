<template>
  <div class="mb-3">
    <label
      :for="id"
      class="form-label"
    >
      {{ label }}
      <input
        :id="id"
        :placeholder="placeholder"
        class="form-control"
        :class="{'is-invalid': help}"
        :value="modelValue"
        :type="type"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <span
        v-if="help"
        class="invalid-feedback"
      >{{ help }}</span>
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
    placeholder: { type: String, default: '' },
    type: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
};
</script>

<style>
</style>
