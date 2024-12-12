<template>
  <label
    class="mx-auto relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
    for="search-bar"
  >
    <input
      id="search-bar"
      placeholder="your keyword here"
      v-model="searchQuery"
      class="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
    />
    <button
      @click="emit('search', searchQuery)"
      class="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
    >
      Search
    </button>
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="w-full md:w-auto px-6 py-3 bg-gray border-black text-black fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
    >
      Clear
    </button>
  </label>
</template>

<script setup lang="ts">
const searchQuery = ref("");
const emit = defineEmits(["search", "clear"]);

const clearSearch = () => {
  searchQuery.value = "";
  emit("clear");
};
</script>
