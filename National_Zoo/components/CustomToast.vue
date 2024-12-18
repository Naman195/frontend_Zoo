<template>
    <div :style="`color: ${color};`">
      <span>{{ message }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    message: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "black",
    }
  });
  </script>
  