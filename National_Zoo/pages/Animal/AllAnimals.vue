<template>
  <div class="flex flex-col items-center">
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
      <p v-if="animals.length === 0" class="text-gray-500 text-center">
        <h1 class="font-bold">
        No Result Found!
      </h1>
      </p>
    </div>
    <div v-if="animals?.length === 0 && currentPage === 0 && !isSearching" 
      class="flex justify-items-center justify-around mt-5"
      :class="['justify-around', isAdmin]"
    >
    
      <p class="text-bold"><h1 class="font-bold">
        No Animal Found!
      </h1> </p>
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

const closeToast = () => {
  isToastVisible.value = false;
};

const resetSearch = () => {
  fetchAnimals(currentPage.value, pageSize.value);
};

const toastMessage = ref("");
const isToastVisible = ref(false);
const formData = ref({
  animalName: "",
  animalType: "",
});

const compareFormdata = ref({
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

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchAnimals(currentPage.value, pageSize.value);
  }
};

const openAddAnimalHandler = () => {
  openAddAnimalModal.value = true;
  fetchCategoriesApi();
};
const selectedAnimal = ref({});
const route = useRoute();
const zooId = route.query.zooId;
const selectedZoo = ref(null);
const animals = ref([]);
const token = useCookie("auth");
const openAddAnimalModal = ref(false);
const opendeleteModal = ref(false);
const animalId = ref("");
const openUpdateModal = ref(false);
const fetchCategories = ref([]);
const isAdmin = ref(false);
const isSearching = ref(false);
const openTransferModal = ref(false);
const selectedTransferredAnimalId = ref(0);

const decodeJWT = (token) => {
  if (!token) return null;
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));

  return decodedPayload;
};

const decodedToken = decodeJWT(token.value);
if (decodedToken && decodedToken.role === "admin") {
  isAdmin.value = true;
}

const deleteAnimalHandler = (animal) => {
  animalId.value = animal.animalId;
  opendeleteModal.value = true;
};

function updateAnimal(animal) {
  openUpdateModal.value = true;
  animalId.value = animal.animalId;
  selectedAnimal.value = animal;
  compareFormdata.value = {...animal};
  // compareFormdata.value.animalType = animal.animalType;
  // compareFormdata.value.animalName = animal.animalName;
  fetchCategoriesApi();
}

function onTransferButtonClick(animal) {
  selectedTransferredAnimalId.value = animal.animalId;
  openTransferModal.value = true;
  FetchZooList();
}

const fetchZooById = async () => {
  const response = await useCustomFetch(`/zoo/id/${zooId}`);
  selectedZoo.value = response;
};

const fetchAnimals = async (
  page = currentPage.value,
  size = pageSize.value
) => {
  const data = await useCustomFetch(
    `/animal/zoo-ani/${zooId}?page=${page}&size=${size}`
  );
  animals.value = data.content;
  totalPages.value = data.totalPages;
  isSearching.value = false;
};

const deleteAnimal = async () => {
  try {
    const data = await useCustomFetch(`/animal/del/${animalId.value}`, {
      method: "PATCH",
    });

    animals.value = animals.value.filter(
      (animal) => animal.animalId !== animalId.value
    );
    opendeleteModal.value = false;
    toastMessage.value = data;
    isToastVisible.value = true;

    if (animals.value.length === 0 && currentPage.value > 0) {
      currentPage.value -= 1;
      fetchAnimals(currentPage.value, pageSize.value);
    }
  } catch (error) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const addAnimal = async () => {
  try {
    const res = await useCustomFetch(`/animal/add`, {
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
  } catch (error) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const updateAnimalHandler = async (fromdata) => {
  
  if(!(
    JSON.stringify(fromdata) !== JSON.stringify(compareFormdata.value)
  )){
    return;
  }

  const resBody = {
    animalName: fromdata.animalName,
    animalType: fromdata.animalType,
    zoo: {
      zooId: fromdata.zoo.zooId,
    },
  };
  try {
    const res = await useCustomFetch(`/animal/update/${animalId.value}`, {
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
  } catch (error) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const fetchCategoriesApi = async () => {
  try {
    const data = await useCustomFetch("/category/all");
    fetchCategories.value = data;
  } catch (error) {}
};

const zooList = ref([]);

const FetchZooList = async () => {
  const data = await useCustomFetch(`/animal/zoo/${zooId}`);
  console.log(data);
  zooList.value = data;
};

const handleTransferAnimal = async (newZooId) => {
  try {
    const res = await useCustomFetch(
      `/animal/transfer/${selectedTransferredAnimalId.value}/to/${newZooId}`,
      {
        method: "patch",
      }
    );
    openTransferModal.value = false;
    fetchAnimals(currentPage.value, pageSize.value);

    toastMessage.value = "Animal Transferred Successfully";
    isToastVisible.value = true;
  } catch (error) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const performSearch = async (searchQuery) => {
  const trimmedQuery = searchQuery.trim();
  if (!trimmedQuery) {
    return;
  }
  try {
    const results = await useCustomFetch(
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
