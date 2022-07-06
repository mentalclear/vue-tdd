<template>
  <div class="card">
    <div class="card-header text-center">
      <slot name="header" />
    </div>
    <div
      v-if="$slots.body"
      class="card-body"
    >
      <slot name="body" />
    </div>
    <slot />
    <div
      v-if="$slots.footer"
      class="card-footer text-center"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
