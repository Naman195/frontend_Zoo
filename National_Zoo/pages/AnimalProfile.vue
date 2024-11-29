<template>
  <div class="flex flex-col items-center">
    <h1>Hello Animal</h1>

    <a
      href="#"
      class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
        alt=""
      />
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ selectedAnimal?.animalName }} --
          {{ selectedAnimal?.zoo?.zooName }}
        </h5>
        <p class="mb-3 font-bold text-gray-700 dark:text-gray-400">
          {{ selectedAnimal?.animalType }}
        </p>
        <button
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          @click="
            () => {
              handleAnimalHistory();
              buttonClick = true;
            }
          "
        >
          View Animal History
        </button>
      </div>
    </a>

    <!-- <div
      class="cursor-pointer group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300"
    >
      <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <img
          class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110"
          src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
          alt="investment-seed-round"
        />
      </div>
      <div class="p-4">
        <h2 class="mb-2 text-slate-800 text-xl font-bold">
          {{ selectedAnimal?.animalName }}
        </h2>

        <p>{{ selectedAnimal?.animalType }}</p>
        <p>{{ selectedAnimal?.zoo?.zooName }}</p>
      </div>
      <div class="flex flex-col items-center mb-2">
        <button
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          View Animal History
        </button>
      </div>
    </div> -->
  </div>

  <div class="flex flex-col items-center">
    <h1 v-if="animalHistory?.length == 0 && buttonClick">
      No History Found for this Animal
    </h1>

    <div
      v-if="animalHistory?.length > 0 && buttonClick"
      class="relative overflow-x-auto"
    >
      <h1>Animal History</h1>
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Animal Name</th>
            <th scope="col" class="px-6 py-3">From Zoo</th>
            <th scope="col" class="px-6 py-3">Too Zoo</th>
            <th scope="col" class="px-6 py-3">User-Name</th>
            <th scope="col" class="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="history in animalHistory"
            :key="history.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ history.animalName }}
            </th>
            <td class="px-6 py-4">{{ history.fromZooName }}</td>
            <td class="px-6 py-4">{{ history.toZooName }}</td>
            <td class="px-6 py-4">{{ history.userName }}</td>
            <td class="px-6 py-4">{{ history.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();

console.log("AnimalId", route.query.id);
const animalId = route.query.id;

const selectedAnimal = ref();
const animalHistory = ref([]);
const buttonClick = ref(false);

const fetchAnimal = async () => {
  const animal = await useCustomFetch(`/animal/ani-id/${animalId}`);

  selectedAnimal.value = animal;
};

const handleAnimalHistory = async () => {
  buttonClick.value = true;
  const data = await useCustomFetch(`/animal/history/${animalId}`);
  console.log("Fetched Data Animal History", data);
  animalHistory.value = data;
};

onMounted(() => {
  fetchAnimal();
});
</script>
