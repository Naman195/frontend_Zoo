<template>
  <div class="max-w-full mx-auto text-center pt-7 relative">
    <h1
      class="text-4xl font-bold text-gray-900 leading-tight mb-2 pb-4 relative center"
    >
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
        >All Animals in Zoo - {{ selectedZooName }}</span
      >
      <span
        class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"
      ></span>
    </h1>

    <button
      v-if="useAuth().isAdmin && animals.length !== 0"
      class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 absolute top-7 right-7"
      type="button"
      @click="openAddAnimalHandler()"
    >
      Add Animal
    </button>
  </div>

  <div class="flex flex-col items-center mx-auto pt-8">
    <div class="w-30">
      <SearchBar
        v-if="!isLoading"
        @search="performSearch"
        @clear="resetSearch"
      />
      <div v-if="isSearching">
        <h1 v-if="animals.length === 0" class="text-gray-500 text-center">
          <p class="font-bold">No Result Found!</p>
        </h1>
      </div>
      <div
        v-if="
          !isLoading &&
          animals?.length === 0 &&
          currentPage === 0 &&
          !isSearching
        "
        class="flex flex-col justify-items-center items-center mt-5"
      >
        <h1 class="text-bold"><p class="font-bold">No Animal Found!</p></h1>
        <div v-if="useAuth().isAdmin">
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
          @handle-image-upload="handleFileUpload"
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
          @handle-image-upload="handleFileUpload"
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

      <!-- ................Loading........................ -->

      <div class="flex flex-col justify-center items-center">
        <img
          v-if="isLoading"
          src="../../assests/gif/loader.gif"
          alt="Loading"
        />
      </div>

      <!-- ....................Loading End........................ -->

      <!-- Display All Animals -->
      <div class="flex flex-wrap justify-center">
        <li
          v-for="animal in animals"
          :key="animal.animalId + animal.image"
          class="m-4 list-none"
        >
          <AnimalCard
            :entity-data="animal"
            @delete="deleteAnimalHandler(animal)"
            @update="updateAnimal(animal)"
            @transfer="onTransferButtonClick(animal)"
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
import type { AnimalPartial } from "~/types/AnimalPartial";
import type { Category } from "~/types/Category";
import type { PaginatedResponse } from "~/types/PaginationResponse";
import type { Zoo } from "~/types/Zoo";
import { useToastNotify } from "~/composables/useToastNotify";

const { showToast } = useToastNotify();

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
  }
};

const resetSearch = () => {
  fetchAnimals(currentPage.value, pageSize.value);
};

const formData = ref<AnimalPartial>({
  animalName: "",
  animalType: "",
  image: null,
});

const compareFormdata = ref<AnimalPartial>({
  animalName: "",
  animalType: "",
  image: null,
});

function intiliazeFormData() {
  (formData.value.animalName = ""),
    (formData.value.animalType = ""),
    (formData.value.image = null);
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

const isLoading = ref(true);
const selectedAnimal = ref<Animal>();
const route = useRoute();
const zooId = route.query.zooId;
const selectedZooName = route.query.zooName;
const animals = ref<Animal[]>([]);
const token = useCookie("auth") || undefined;
const openAddAnimalModal = ref(false);
const opendeleteModal = ref(false);
const animalId = ref<string>("");
const openUpdateModal = ref<boolean>(false);
const fetchCategories = ref<Category[]>([]);
const isSearching = ref(false);
const openTransferModal = ref(false);
const selectedTransferredAnimalId = ref<string>("");

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

const fetchAnimals = async (
  page: number = currentPage.value,
  size: number = pageSize.value
): Promise<void> => {
  try {
    const data = await useCustomFetch<PaginatedResponse<Animal>>(
      `/animal/all/${zooId}?page=${page}&size=${size}`
    );

    animals.value = data.content;
    totalPages.value = data.totalPages;
    isSearching.value = false;
  } catch (error: any) {
    console.log("Errors Occur", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteAnimal = async () => {
  try {
    const data = await useCustomFetch<string>(
      `/animal/delete/${animalId.value}`,
      {
        method: "PATCH",
      }
    );

    if (animals.value.length === 1 && currentPage.value > 0) {
      currentPage.value -= 1;
      fetchAnimals(currentPage.value, pageSize.value);
    } else {
      fetchAnimals(currentPage.value, pageSize.value);
    }
    opendeleteModal.value = false;
    showToast(data || "Animal deleted successfully.", "green");
  } catch (error: any) {
    showToast(error || "Error occured in deleting animal", "red");
  }
};

const addAnimal = async () => {
  console.log("Added Animal Data", formData.value);
  try {
    const formBodyData = new FormData();

    formBodyData.append(
      "animal",
      JSON.stringify({
        animalName: formData.value.animalName,
        animalType: formData.value.animalType,
        zoo: {
          zooId: zooId,
        },
      })
    );

    if (formData.value.image) {
      formBodyData.append("file", formData.value.image);
    }

    const res = await useCustomFetch(`/animal/add`, {
      method: "POST",
      body: formBodyData,
    });

    openAddAnimalModal.value = false;
    intiliazeFormData();
    showToast("Added Successfully", "green");

    fetchAnimals(currentPage.value, pageSize.value);
  } catch (error: any) {
    showToast(error || "Error Occured in add animals", "red");
  }
};

const updateAnimalHandler = async (fromdata: Animal): Promise<void> => {
  if (!(JSON.stringify(fromdata) !== JSON.stringify(compareFormdata.value))) {
    return;
  }
  try {
    const formBodyData = new FormData();
    formBodyData.append(
      "animal",
      JSON.stringify({
        animalName: fromdata.animalName,
        animalType: fromdata.animalType,
        zoo: {
          zooId: fromdata.zoo.zooId,
        },
      })
    );

    if (fromdata.image != null) {
      formBodyData.append("file", fromdata.image);
    }

    const res = await useCustomFetch(`/animal/update/${animalId.value}`, {
      method: "PATCH",
      body: formBodyData,
    });

    openUpdateModal.value = false;
    intiliazeFormData();

    showToast("Update Successfully", "green");
    fetchAnimals(currentPage.value, pageSize.value);
  } catch (error: any) {
    showToast(error || "Error occured while updating animal", "red");
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
  const data = await useCustomFetch<Zoo[]>(`/animal/getzoolist/${zooId}`);
  zooList.value = data;
};

const handleTransferAnimal = async (newZooId: number) => {
  try {
    const res = await useCustomFetch(
      `/animal/transfer/${selectedTransferredAnimalId.value}/to/${newZooId}`,
      {
        method: "patch",
      }
    );
    openTransferModal.value = false;
    fetchAnimals(currentPage.value, pageSize.value);
    showToast("Animal Transferred Successfully", "green");
  } catch (error: any) {
    showToast(error || "Error occured while transferring animal", "red");
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
  fetchAnimals(currentPage.value, pageSize.value);
});
</script>
