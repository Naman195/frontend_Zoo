<!-- <template>
  <div
    v-if="isVisible"
    id="dismiss-toast"
    class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
    role="alert"
    tabindex="-1"
    aria-labelledby="hs-toast-dismiss-button-label"
  >
    <div class="flex p-4">
      <p
        id="hs-toast-dismiss-button-label"
        class="text-sm text-gray-700 dark:text-neutral-400"
      >
        {{ alertMessage }}
      </p>

      <div class="ms-auto">
        <button
          @click="emit('closeModal')"
          type="button"
          class="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
          aria-label="Close"
          data-hs-remove-element="#dismiss-toast"
        >
          <span class="sr-only">Close</span>
          <svg
            class="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
const emit = defineEmits(["closeModal"]);
defineProps({ alertMessage: String, isVisible: Boolean });
</script> -->

<!-- <script setup>
import { toast } from "vue3-toastify";
defineProps({ alertMessage: String, isVisible: Boolean, messageType: String });

const notify = () => {
  toast.props.messageType(props.alertMessage);
};
</script>

<template>
  <button @click="notify">notify by click</button>
</template> -->
<!-- 
<template>
  <div :style="`color: ${color}`">
    {{ alertMessage }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  alertMessage: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
});
</script> -->

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
