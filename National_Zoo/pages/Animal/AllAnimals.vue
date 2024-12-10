<template>
  <div class="flex flex-col items-center h-screen bg-red-100">
    <div class="absolute top-0 end-0">
      <ShowAlert
        :alert-message="toastMessage"
        :is-visible="isToastVisible"
        @close-modal="closeToast"
      />
    </div>
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center font-bold">
        All Animals in Zoo - {{ selectedZoo?.zooName }}
      </h1>
      <div v-if="isAdmin && animals.length !== 0">
        <button
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
          type="button"
          @click="openAddAnimalHandler()"
        >
          Add Animal
        </button>
      </div>
    </div>
    <div class="w-full max-w-6xl px-4">
      <SearchBar @search="performSearch" @clear="resetSearch" />
      <!-- <p v-if="animals.length === 0" class="text-gray-500 text-center">
        No Results Found
      </p> -->
      <div v-if="isSearching">
        <h1 v-if="animals.length === 0" class="text-gray-500 text-center">
          <p class="font-bold">No Result Found!</p>
        </h1>
      </div>
      <div
        v-if="animals?.length === 0 && currentPage === 0 && !isSearching"
        class="flex justify-items-center justify-around mt-5"
        :class="['justify-around', isAdmin]"
      >
        <h1 class="text-bold"><p class="font-bold">No Animal Found!</p></h1>
        <div v-if="isAdmin">
          <button
            class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
            type="button"
            @click="openAddAnimalHandler()"
          >
            Add Animal
          </button>
        </div>
      </div>

      <div v-if="openAddAnimalModal" class="z-50 absolute top-1/2">
        <AddAnimal
          :from-data="formData"
          :modal-title="'Add'"
          :submit-button-label="'Add Animal'"
          :fetch-categories="fetchCategories"
          @close="
            openAddAnimalModal = false;
            intiliazeFormData();
          "
          @save="addAnimal()"
        />
      </div>

      <div v-if="openUpdateModal" class="z-50 absolute top-1/2">
        <AddAnimal
          :from-data="selectedAnimal"
          :modal-title="'Update'"
          :submit-button-label="'Update Animal'"
          :fetch-categories="fetchCategories"
          @close="(openUpdateModal = false), intiliazeFormData()"
          @save="updateAnimalHandler"
        />
      </div>
      <div v-if="openTransferModal" class="z-50 absolute top-1/2">
        <TransferAnimal
          :fetch-zoo-list="zooList"
          @close="openTransferModal = false"
          @save="handleTransferAnimal"
        />
      </div>

      <div v-if="opendeleteModal" class="z-50 absolute top-1/2">
        <Modal
          :message="'Animal'"
          @delete-user="deleteAnimal"
          @close-modal="opendeleteModal = false"
        />
      </div>

      <!-- Display All Animals -->
      <div class="flex flex-wrap justify-center">
        <li
          v-for="animal in animals"
          :key="animal.animalId"
          class="m-4 list-none"
        >
          <!-- {{ animal }} -->
          <ShowCards
            :entity-data="animal"
            @delete="deleteAnimalHandler(animal)"
            @update="updateAnimal(animal)"
            @transfer="onTransferButtonClick(animal)"
            delete-button-label="Delete Animal"
            update-button-label="Update Animal"
            view-button-label="view Animal"
          />
        </li>
      </div>
    </div>
    <div v-if="!isSearching && animals.length !== 0">
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        @update:currentPage="changePage"
        @fetch-data="fetchAnimals"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AddAnimal from "~/components/animal/AddAnimal.vue";
import type { Animal } from "~/types/Animal";
import type { Category } from "~/types/Category";
import type { PaginatedResponse } from "~/types/PaginationResponse";
import type { Zoo } from "~/types/Zoo";

interface DecodedToken {
  role?: string;
}

const closeToast = () => {
  isToastVisible.value = false;
};

const resetSearch = () => {
  fetchAnimals(currentPage.value, pageSize.value);
};

const toastMessage = ref<string>("");
const isToastVisible = ref<boolean>(false);

const formData = ref<Partial<Animal>>({
  animalName: "",
  animalType: "",
});

const compareFormdata = ref<Partial<Animal>>({
  animalName: "",
  animalType: "",
});

const formDataChanged = () => {
  return (
    JSON.stringify(formData.value) !== JSON.stringify(compareFormdata.value)
  );
};

function intiliazeFormData() {
  (formData.value.animalName = ""), (formData.value.animalType = "");
}

const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(3);

const changePage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchAnimals(currentPage.value, pageSize.value);
  }
};

const openAddAnimalHandler = () => {
  openAddAnimalModal.value = true;
  fetchCategoriesApi();
};

const selectedAnimal = ref<Partial<Animal>>({});
const route = useRoute();
const zooId = route.query.zooId;
const selectedZoo = ref<Zoo | null>(null);
const animals = ref<Animal[]>([]);
const token = useCookie("auth") || undefined;
const openAddAnimalModal = ref(false);
const opendeleteModal = ref(false);
const animalId = ref<string>("");
const openUpdateModal = ref<boolean>(false);
const fetchCategories = ref<Category[]>([]);
const isAdmin = ref(false);
const isSearching = ref(false);
const openTransferModal = ref(false);
const selectedTransferredAnimalId = ref<string>("");

const decodeJWT = (token: string | undefined): DecodedToken | null => {
  if (!token) return null;
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));

  return decodedPayload;
};

const decodedToken = decodeJWT(token?.value ?? undefined);
if (decodedToken && decodedToken.role === "admin") {
  isAdmin.value = true;
}

const deleteAnimalHandler = (animal: Animal) => {
  animalId.value = animal.animalId;
  opendeleteModal.value = true;
};

function updateAnimal(animal: Animal) {
  openUpdateModal.value = true;
  animalId.value = animal.animalId;
  selectedAnimal.value = animal;
  compareFormdata.value = { ...animal };
  fetchCategoriesApi();
}

function onTransferButtonClick(animal: Animal) {
  selectedTransferredAnimalId.value = animal.animalId;
  openTransferModal.value = true;
  FetchZooList();
}

const fetchZooById = async () => {
  try {
    const response = await useCustomFetch<Zoo>(`/zoo/id/${zooId}`);
    selectedZoo.value = response;
  } catch (error) {
    console.error("Failed to fetch zoo:", error);
    selectedZoo.value = null;
  }
};

const fetchAnimals = async (
  page: number = currentPage.value,
  size: number = pageSize.value
): Promise<void> => {
  const data = await useCustomFetch<PaginatedResponse<Animal>>(
    `/animal/ZooAnimalsByZooId/${zooId}?page=${page}&size=${size}`
  );
  animals.value = data.content;
  totalPages.value = data.totalPages;
  isSearching.value = false;
};

const deleteAnimal = async () => {
  try {
    const data = await useCustomFetch<string>(
      `/animal/deleteAnimalById/${animalId.value}`,
      {
        method: "PATCH",
      }
    );

    animals.value = animals.value.filter(
      (animal) => animal.animalId !== animalId.value
    );
    opendeleteModal.value = false;
    toastMessage.value = data || "Animal deleted successfully.";
    isToastVisible.value = true;

    if (animals.value.length === 0 && currentPage.value > 0) {
      currentPage.value -= 1;
      fetchAnimals(currentPage.value, pageSize.value);
    }
  } catch (error: any) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const addAnimal = async () => {
  try {
    const res = await useCustomFetch(`/animal/addAnimal`, {
      method: "POST",
      body: {
        ...formData.value,
        zoo: {
          zooId: zooId,
        },
      },
    });

    openAddAnimalModal.value = false;
    intiliazeFormData();
    toastMessage.value = "Added Successfully";
    isToastVisible.value = true;
    fetchAnimals(currentPage.value, pageSize.value);
  } catch (error: any) {
    toastMessage.value = error.response._data;
    isToastVisible.value = true;
  }
};

const updateAnimalHandler = async (
  fromdata: Partial<Animal>
): Promise<void> => {
  if (!(JSON.stringify(fromdata) !== JSON.stringify(compareFormdata.value))) {
    return;
  }

  const resBody = {
    animalName: fromdata.animalName,
    animalType: fromdata.animalType,
    zoo: {
      zooId: fromdata.zoo?.zooId,
    },
  };
  try {
    const res = await useCustomFetch(`/animal/updateAnimal/${animalId.value}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: resBody,
    });
    openUpdateModal.value = false;
    intiliazeFormData();

    toastMessage.value = "Update Successfully";
    isToastVisible.value = true;

    fetchAnimals(currentPage.value, pageSize.value);
  } catch (error: any) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const fetchCategoriesApi = async () => {
  try {
    const data = await useCustomFetch<Category[]>("/category/all");
    fetchCategories.value = data;
  } catch (error) {}
};

const zooList = ref<Zoo[]>([]);

const FetchZooList = async () => {
  const data = await useCustomFetch<Zoo[]>(`/animal/zooListByZooId/${zooId}`);
  zooList.value = data;
};

const handleTransferAnimal = async (newZooId: number) => {
  try {
    const res = await useCustomFetch(
      `/animal/transferAnimal/${selectedTransferredAnimalId.value}/to/${newZooId}`,
      {
        method: "patch",
      }
    );
    openTransferModal.value = false;
    fetchAnimals(currentPage.value, pageSize.value);

    toastMessage.value = "Animal Transferred Successfully";
    isToastVisible.value = true;
  } catch (error: any) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const performSearch = async (searchQuery: string) => {
  const trimmedQuery = searchQuery.trim();
  if (!trimmedQuery) {
    return;
  }
  try {
    const results = await useCustomFetch<Animal[]>(
      `/animal/search?searchTerm=${trimmedQuery}&zooId=${route.query.zooId}`
    );
    animals.value = results;
    isSearching.value = true;
  } catch (error) {
    console.error("Error during search:", error);
  }
};

onMounted(() => {
  fetchZooById();
  fetchAnimals(currentPage.value, pageSize.value);
});
</script>
