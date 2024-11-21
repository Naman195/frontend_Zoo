<template>
  <div class="flex flex-col items-center">
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center">
        All Animals in Zoo - {{ selectedZoo?.zooName }}
      </h1>
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
        :from-data="formData"
        :modal-title="'Update'"
        :submit-button-label="'Update Animal'"
        :fetch-categories="fetchCategories"
        @close="(openUpdateModal = false), intiliazeFormData()"
        @save="updateAnimal()"
      />
    </div>

    <div v-if="deletedAlert" class="z-50 absolute top-1/2">
      <ShowAlert
        :alert-message="'Animal Deleted Successfully'"
        @close-modal="deletedAertClose"
      />
    </div>
    <div v-if="addAnimalAlert" class="z-50 absolute top-1/2">
      <ShowAlert
        :alert-message="'Animal Added Successfully'"
        @close-modal="addAertClose"
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
          @update="onClick(animal)"
          delete-button-label="Delete Animal"
          update-button-label="Update Animal"
          view-button-label="view Animal"
        />
      </li>
    </div>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :pageSize="pageSize"
      @update:currentPage="changePage"
      @fetch-data="fetchAnimals"
    />
  </div>
</template>

<script setup>
import AddAnimal from "~/components/animal/AddAnimal.vue";

const formData = ref({
  animalName: "",
  animalType: "",
});

const compareFormdata = ref({
  animalName: "",
  animalType: "",
});

const addAertClose = () => {
  addAnimalAlert.value = false;
};

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
  fetchCategoriesApi(); // Fetch categories when opening the add modal
};

const route = useRoute();
const zooId = route.query.zooId;

const selectedZoo = ref(null);
const animals = ref([]);
const token = useCookie("auth");
const openAddAnimalModal = ref(false);
const deletedAlert = ref(false);
const opendeleteModal = ref(false);
const animalId = ref("");
const openUpdateModal = ref(false);
const addAnimalAlert = ref(false);
const fetchCategories = ref([]);
const isAdmin = ref(false);

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

console.log("isAdmin Value", isAdmin.value);

const deletedAertClose = () => {
  deletedAlert.value = false;
};

const deleteAnimalHandler = (animal) => {
  animalId.value = animal.animalId;
  opendeleteModal.value = true;
};

function onClick(animal) {
  openUpdateModal.value = true;
  animalId.value = animal.animalId;
  formData.value.animalName = animal.animalName;
  formData.value.animalType = animal.animalType;
  compareFormdata.value.animalType = animal.animalType;
  compareFormdata.value.animalName = animal.animalName;
  fetchCategoriesApi();
}

console.log("Deleted ANimal Id is", animalId.value);

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
  console.log("Total Animals in Zoo is", animals);
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
    deletedAlert.value = true;
  } catch (error) {}
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
    // console.log("AnimalAdded SuccessFully", res);
    addAnimalAlert.value = true;
  } catch (error) {
    console.log("Error in Adding Animal", error);
  }
};

const updateAnimal = async () => {
  if (!formDataChanged()) {
    return;
  }
  try {
    const res = await useCustomFetch(`/animal/update/${animalId.value}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: {
        ...formData.value,
        zoo: {
          zooId: zooId,
        },
      },
    });
    openUpdateModal.value = false;
    intiliazeFormData();

    fetchAnimals(currentPage.value, pageSize.value);
  } catch (error) {
    console.error("Error updating Animal:", error);
  }
};

const fetchCategoriesApi = async () => {
  try {
    const data = await useCustomFetch("/category/all");
    fetchCategories.value = data;
    console.log("FetchedCategory", fetchCategories);
  } catch (error) {}
};

onMounted(() => {
  fetchZooById();
  fetchAnimals(currentPage.value, pageSize.value);
});
</script>
