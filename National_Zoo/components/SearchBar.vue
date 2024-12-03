<template>
  <div class="flex items-center space-x-2">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by zoo name or location (e.g., Country, State, City)"
      class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      @click="emit('search', searchQuery)"
      class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Search
    </button>
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-200"
    >
      Clear
    </button>
  </div>
</template>

<script setup>
const searchQuery = ref("");
const emit = defineEmits(["search", "clear"]);

const clearSearch = () => {
  searchQuery.value = "";
  emit("clear");
};
</script>
