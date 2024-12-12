<template>
  <div class="flex justify-center items-center mt-6 space-x-4">
    <button
      class="rounded-full p-2 border border-transparent text-center text-gray-500 transition-all hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
      :disabled="currentPage === 0"
      @click="changePage(currentPage - 1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <div class="flex space-x-1">
      <button
        v-for="page in totalPages"
        :key="page"
        class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-sm transition-colors duration-200"
        :class="{
          'bg-blue-500 text-white': page - 1 === currentPage,
          'bg-white text-gray-700 hover:bg-gray-200': page - 1 !== currentPage,
        }"
        @click="changePage(page - 1)"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="rounded-full p-2 border border-transparent text-center text-gray-500 transition-all hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
      :disabled="currentPage + 1 >= totalPages"
      @click="changePage(currentPage + 1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:currentPage", "fetch-data"]);

const changePage = (page: number) => {
  if (page >= 0 && page < props.totalPages) {
    emit("update:currentPage", page);
    // emit("fetch-data", page, props.pageSize);
  }
};
</script>
