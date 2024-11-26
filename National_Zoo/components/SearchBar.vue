<template>
  <div class="flex items-center space-x-2">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by zoo name or location (e.g., Country, State, City)"
      class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      @click="performSearch"
      class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Search
    </button>
  </div>
</template>

<script setup>
const searchQuery = ref("");
const emit = defineEmits(["results"]);

const performSearch = async () => {
  const trimmedQuery = searchQuery.value.trim();
  if (!trimmedQuery) {
    return;
  }
  const results = ref([]);

  if (trimmedQuery.includes(",")) {
    const [country, state, city] = trimmedQuery
      .split(",")
      .map((part) => part.trim());
    const data = await useCustomFetch(
      `/zoo/search/zoos/location?country=${country}&state=${state || ""}&city=${
        city || ""
      }`
    );
    console.log(data);
    results.value = data;
  } else {
    const data = await useCustomFetch(
      `/zoo/search/zoos/name?name=${trimmedQuery}`
    );
    console.log("Content is", data.content);
    results.value = data;
    console.log("Results Array is", results);
  }
  emit("results", results);
};
</script>
