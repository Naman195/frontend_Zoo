<template>
  <div class="flex flex-col items-center">
    {{ formData }}
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
        :submit-button-label="'Update Animal'"
        @close="(openUpdateModal = false), intiliazeFormData()"
        @save="updateAnimal()"
      />
    </div>

    <!-- <div v-if="deletedAlert" class="z-50 absolute top-1/2">
      <ShowAlert
        :alert-message="'Animal Deleted Successfully'"
        @close-modal="deletedAertClose"
      />
    </div> -->

    <div v-if="opendeleteModal" class="z-50 absolute top-1/2">
      <Modal
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
              View Animal
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
  </div>
</template>

<script setup>
import AddAnimal from "~/components/animal/AddAnimal.vue";

const formData = ref({
  animalName: "",
  animalType: "",
});

function intiliazeFormData() {
  (formData.value.animalName = ""), (formData.value.animalType = "");
}

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
}

console.log("Deleted ANimal Id is", animalId.value);

const fetchZooById = async () => {
  const response = await $fetch(`http://localhost:8080/api/zoo/id/${zooId}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  selectedZoo.value = response;
};

const fetchAnimals = async () => {
  const data = await $fetch(
    `http://localhost:8080/api/animal/zoo-ani/${zooId}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );
  animals.value = data.content;
  console.log(animals);
};

const deleteAnimal = async () => {
  const data = await $fetch(
    `http://localhost:8080/api/animal/del/${animalId.value}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  animals.value = animals.value.filter(
    (animal) => animal.animalId !== animalId.value
  );
  opendeleteModal.value = false;
};

const addAnimal = async () => {
  const res = await $fetch(`http://localhost:8080/api/animal/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: {
      ...formData.value,
      zoo: {
        zooId: zooId,
      },
    },
  });

  openAddAnimalModal.value = false;
  console.log("AnimalAdded SuccessFully", res);
};

const updateAnimal = async () => {
  try {
    const res = await $fetch(
      `http://localhost:8080/api/animal/update/${animalId.value}`,
      {
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
      }
    );
    openUpdateModal.value = false;
  } catch (error) {
    console.error("Error updating Animal:", error);
  }
};

onMounted(() => {
  fetchZooById();
  fetchAnimals();
});
</script>
