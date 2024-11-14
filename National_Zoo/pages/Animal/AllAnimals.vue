<template>
  <div class="flex flex-col items-center">
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center">
        All Animals in Zoo - {{ selectedZoo?.zooName }}
      </h1>
      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
        type="button"
        @click="openAddAnimalModal = true"
      >
        Add Animal
      </button>
    </div>
    <div v-if="openAddAnimalModal" class="z-50 absolute top-1/2">
      <AddAnimal
        :from-data="formData"
        :modal-title="'Add'"
        :submit-button-label="'Add Animal'"
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
        <div
          class="cursor-pointer group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300"
        >
          <div
            class="relative h-56 m-2.5 overflow-hidden text-white rounded-md"
          >
            <img
              class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110"
              src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
              alt="investment-seed-round"
            />
          </div>
          <div class="p-4">
            <h5 class="mb-2 text-slate-800 text-xl font-semibold">
              {{ animal.animalName }}
            </h5>
            <h6>{{ animal.animalType }}</h6>

            <!-- <p class="text-slate-600 leading-normal font-light">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </p> -->
          </div>
          <div class="px-4 pb-4 pt-0 mt-2">
            <button
              class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-2"
              type="button"
            >
              <nuxt-link
                :to="{
                  path: '/animalprofile',
                }"
              >
                View Animal
              </nuxt-link>
            </button>
            <button
              class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2"
              type="button"
              @click="
                () => {
                  deleteAnimalHandler(animal);
                }
              "
            >
              Delete Animal
            </button>
            <button
              class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              @click="() => onClick(animal)"
            >
              Update Animal
            </button>
          </div>
        </div>
      </li>
    </div>
    <div class="flex justify-center items-center mt-6 space-x-2">
      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2"
        :disabled="currentPage === 0"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>

      <!-- Page Numbers -->
      <div class="flex space-x-1">
        <button
          v-for="page in totalPages"
          :key="page"
          class="px-3 py-2 rounded-md border border-gray-300 text-sm transition-colors duration-200"
          :class="{
            'bg-blue-500 text-white': page - 1 === currentPage,
            'bg-white text-gray-700 hover:bg-gray-200':
              page - 1 !== currentPage,
          }"
          @click="changePage(page - 1)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2"
        :disabled="currentPage + 1 >= totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
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
    fetchAnimals(currentPage.value, pageSize.value);
  } catch (error) {
    console.error("Error updating Animal:", error);
  }
};

onMounted(() => {
  fetchZooById();
  fetchAnimals(currentPage.value, pageSize.value);
});
</script>
