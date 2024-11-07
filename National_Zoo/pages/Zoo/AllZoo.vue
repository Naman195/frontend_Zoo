<template>
  <h1>All Zoo's</h1>
  <div class="flex justify-end mb-8 mr-3">
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="
        () => {
          openModal = true;
        }
      "
    >
      Add Zoo
    </button>
  </div>
  <!-- <div v-if="isUpdateModalVisible">
    <AddZoo />
  </div> -->

  <div v-if="openModal" class="z-50 absolute top-1/2">
    <AddZoo @close="openModal = false" />
  </div>

  <ul class="gap-y-4 space-y-4">
    <li v-for="(zoo, id) in Zoos" :key="id">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center gap-4">
          <!-- Card 1 -->
          <div
            class="flex flex-col items-center bg-white border border-blue-200 rounded-lg shadow md:flex-row max-w-4xl w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-700"
          >
            <img
              class="object-cover w-full rounded-t-lg h-64 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src="https://fastly.picsum.photos/id/448/200/200.jpg?hmac=bBnq1esMuSqfETvk9QP1YhdRdXQTSPJDKoQFvvJGfrQ"
              alt="Tech Image 1"
            />
            <div class="flex flex-col justify-between p-6 leading-normal">
              <h5
                class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ zoo.zooName }}
              </h5>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {{ zoo.address.street }}
                {{ zoo.address.city.cityName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
const Zoos = ref();
const token = useCookie("auth");
const openModal = ref(false);

console.log("Zoos Object Is ", Zoos);
// console.log("Zoos VAlue  Is ", Zoos.zooName);

const fetchZoo = async () => {
  const data = await $fetch(`http://localhost:8080/api/zoo/all`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  Zoos.value = data.content;

  // console.log("Feteched Data is ", data.content[0].zooName);
};

onBeforeMount(() => {
  fetchZoo();
});
</script>
