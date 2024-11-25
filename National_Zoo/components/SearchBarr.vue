<template>
    <div class="flex items-center space-x-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by animal name or type"
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
  import { ref } from 'vue';
  
  const props = defineProps({
    zooId: {
    type: String,
    required: true,
  },
  })
  
  const searchQuery = ref('');
  const emit = defineEmits(['results']);
  
  console.log("ZooId is", props.zooId);
  
  const performSearch = async () => {
    const trimmedQuery = searchQuery.value.trim();
    if (!trimmedQuery) {
      console.log('Search query is empty. Skipping API call.');
      return;
    }
  
    try {
      const results = await useCustomFetch(
        `/animal/search?searchTerm=${trimmedQuery}&zooId=${props.zooId}`
      );
      emit('results', results);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  </script>
  