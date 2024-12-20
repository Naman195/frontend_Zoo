<template>
  <div
    v-if="isVisible"
    class="fixed top-15 right-2 z-50 flex items-center max-w-sm p-4 text-gray-700 bg-red border border-gray-200 rounded-lg shadow-lg dark:bg-red-800 dark:text-gray-200 dark:border-gray-700"
    role="alert"
  >
    <!-- Toast Message -->
    <div class="flex-1 text-sm font-medium">
      {{ alertMessage }}
    </div>

    <!-- Close Button -->
    <button
      @click="emit('closeModal')"
      type="button"
      class="inline-flex items-center justify-center w-6 h-6 ml-4 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  alertMessage: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 3000,
  },
  isVisible: Boolean,
});

const emit = defineEmits(["closeModal"]);

const closeToast = () => {
  emit("closeModal");
};

onMounted(() => {
  setTimeout(() => {
    closeToast();
  }, 3000);
});
</script>
