<template>
  <div class="flex flex-col items-center">
    <img
      class="rounded w-80 h-50 mt-5"
      src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
      alt="Animal Image"
    />
    <div class="flex flex-col justify-between p-4 leading-normal">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {{ selectedAnimal?.animalName }} -- {{ selectedAnimal?.zoo?.zooName }}
      </h5>
      <p class="mb-3 font-bold text-gray-700 dark:text-gray-400">
        {{ selectedAnimal?.animalType }}
      </p>

      <h1 v-if="!isAdmin" class="font-bold">
        {{ selectedAnimal?.animalName }}
      </h1>

      <button
        v-if="isAdmin"
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        @click="handleAnimalHistory"
      >
        View Animal History
      </button>
    </div>
    <!-- </div> -->

    <div
      v-if="buttonClick"
      class="flex flex-col items-center w-full mt-6 space-y-4"
    >
      <h1 v-if="animalHistory.length === 0" class="text-lg font-bold">
        No History Found for this Animal
      </h1>

      <div
        v-if="animalHistory.length > 0"
        class="relative overflow-x-auto w-full max-w-4xl"
      >
        <h1 class="text-xl font-bold mb-4">Animal History</h1>
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Animal Name</th>
              <th scope="col" class="px-6 py-3">From Zoo</th>
              <th scope="col" class="px-6 py-3">To Zoo</th>
              <th scope="col" class="px-6 py-3">User Name</th>
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
  </div>
</template>

<script setup lang="ts">
import type { Animal } from "~/types/Animal";
import type { AnimalHistory } from "~/types/AnimalHistory";

const route = useRoute();
const animalId = route.query.id as string;
const selectedAnimal = ref<Animal | null>(null);
const animalHistory = ref<AnimalHistory[]>([]);
const buttonClick = ref(false);
const isAdmin = ref(false);
const token = useCookie("auth");

const fetchAnimal = async () => {
  const animal = await useCustomFetch<Animal>(`/animal/ani-id/${animalId}`);
  selectedAnimal.value = animal;
};

const handleAnimalHistory = async () => {
  buttonClick.value = true;
  const data = await useCustomFetch<AnimalHistory[]>(
    `/animal/history/${animalId}`
  );
  animalHistory.value = data;
};

const decodeJWT = (token: string | undefined) => {
  if (!token) return null;
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload;
};

const decodedToken = decodeJWT(token?.value ?? undefined);
if (decodedToken && decodedToken.role === "admin") {
  isAdmin.value = true;
}

onMounted(() => {
  fetchAnimal();
});
</script>
