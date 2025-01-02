<template>
  <!-- ................Loading........................ -->

  <div class="flex flex-col justify-center items-center">
    <img v-if="isLoading" src="../../assests/gif/loader.gif" alt="Loading" />
  </div>

  <!-- ....................Loading End........................ -->

  <div v-if="!isLoading" class="flex flex-col items-center">
    <div v-if="animalHistory.length == 0" class="flex flex-col items-center">
      <h1 class="text-lg font-bold">No History Found for this Animal</h1>
    </div>
    <div v-else class="flex flex-col items-center">
      <img
        class="rounded w-80 h-50 mt-5"
        src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
        alt="Animal Image"
      />
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Animal Name: {{ selectedAnimal?.animalName }}
        </h5>
        <p class="mb-3 font-bold text-Blue-700">
          Animal Category:
          {{ selectedAnimal?.animalType }}
        </p>

        <h1 v-if="!useAuth().isAdmin" class="font-bold">
          {{ selectedAnimal?.animalName }}
        </h1>
      </div>

      <div class="flex flex-col items-center w-full mt-6 space-y-4">
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
  </div>
</template>

<script setup lang="ts">
import type { Animal } from "~/types/Animal";
import type { AnimalHistory } from "~/types/AnimalHistory";

interface transferredAnimalResponse {
  animalData: Animal;
  transferData: AnimalHistory[];
}

const route = useRoute();
const animalId = route.query.id as string;
const selectedAnimal = ref<Animal | null>(null);
const animalHistory = ref<AnimalHistory[]>([]);
const buttonClick = ref(false);
const isLoading = ref(true);

const handleAnimalHistory = async () => {
  try {
    const data = await useCustomFetch<transferredAnimalResponse>(
      `/animal/history/${animalId}`
    );

    console.log("Animal History", data);

    console.log("transferData", typeof data.transferData);

    animalHistory.value = data.transferData;
    selectedAnimal.value = data.animalData;
  } catch (error: any) {
    console.log("Error in Fetched History", error._data.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  handleAnimalHistory();
});
</script>
