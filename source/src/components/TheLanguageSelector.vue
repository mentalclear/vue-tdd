<template>
  <div>
    <img
      src="https://flagcdn.com/20x15/ru.png"
      height="20"
      alt="Russia"
      title="Русский"
      @click="$i18n.locale = 'ru'"
      @keydown="$i18n.locale = 'ru'"
    >
    <img
      src="https://flagcdn.com/20x15/us.png"
      height="20"
      alt="United States"
      title="English"
      @click="$i18n.locale = 'en'"
      @keydown="$i18n.locale = 'en'"
    >
  </div>
</template>

<script>
</script>

<style scoped>
img {
  cursor: pointer;
}
</style>
