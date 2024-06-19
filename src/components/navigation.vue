<template>
  <v-list nav v-if="pages">
    <v-list-item
      v-for="navItem in pages"
      :key="navItem.to"
      :active="navItem.uri == current"
      :to="navItem.to"
    >
      <template v-if="navItem.type == 'divider'">
        <v-divider></v-divider>
      </template>
      <template v-else>
        <v-list-item-icon
          ><v-icon :name="navItem.icon" :color="navItem.color"
        /></v-list-item-icon>
        <v-list-item-content>
          <v-text-overflow :text="navItem.label" />
        </v-list-item-content>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup>
const props = defineProps({
  current: {
    type: String,
    default: null,
  },
  pages: {
    type: Array,
    default: [],
  },
});
</script>
