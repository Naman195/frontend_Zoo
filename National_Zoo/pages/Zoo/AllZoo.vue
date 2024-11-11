<template>
  <div class="bg-gradient-to-b from-blue-200 to-blue-500 min-h-screen py-10">
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center">All Zoo</h1>
      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
        type="button"
        @click="
          () => {
            openAddAnimalModal = true;
          }
        "
      >
        Add Animal
      </button>
    </div>
    <div v-if="deletedAlert" class="z-50 absolute top-1/2">
      <ShowAlert
        :alert-message="'Zoo Deleted Successfully'"
        @close-modal="deletedAertClose"
      />
    </div>

    <div v-if="updateAlert">
      <ShowAlert
        :alert-message="'Zoo Updated  Successfully'"
        @close-modal="closeUpdateAlert"
      />
    </div>

    <div v-if="addAlert">
      <ShowAlert
        :alert-message="'Zoo Added  Successfully'"
        @close-modal="closeAddAlert"
      />
    </div>

    <div v-if="openModal" class="z-50 absolute top-1/2">
      <AddZoo @close="openModal = false" @add-zoo="handleAddZooAlert" />
    </div>

    <div v-if="openUpdateModal" class="z-50 absolute top-1/2">
      <UpdateZoo
        :zoo="selectedZoo"
        @close="openUpdateModal = false"
        @update-zoo="handleUpdateAlert"
      />
    </div>

    <div v-if="opendeleteModal" class="z-50 absolute top-1/2">
      <Modal @delete-user="deleteZoo" @close-modal="opendeleteModal = false" />
    </div>

    <ul class="gap-y-4 space-y-4">
      <li
        v-for="(zoo, id) in Zoos"
        :key="id"
        class="container mx-auto px-4 max-w-2xl"
      >
        <!-- Card and Button Container -->
        <div
          class="flex items-center space-x-4 bg-white border border-blue-200 rounded-lg shadow max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-700 p-4"
        >
          <!-- Zoo Card Content -->
          <div class="flex items-center w-full">
            <img
              class="object-cover w-48 h-48 rounded-lg"
              src="https://fastly.picsum.photos/id/448/200/200.jpg?hmac=bBnq1esMuSqfETvk9QP1YhdRdXQTSPJDKoQFvvJGfrQ"
              alt="Zoo Image"
            />
            <div
              class="flex flex-col justify-between p-4 leading-normal flex-grow"
            >
              <h5
                class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ zoo.zooName }}
              </h5>
              <p class="font-normal text-gray-700 dark:text-gray-400">
                {{ zoo.address.street }}, {{ zoo.address.city.cityName }}
              </p>
            </div>
          </div>

          <!-- Buttons Container -->
          <div class="flex space-x-2">
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              @click="deleteZooHandler(zoo)"
            >
              Delete
            </button>
            <button
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              @click="() => onClick(zoo)"
            >
              Update
            </button>
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <nuxt-link
                :to="{
                  path: '/animal/allanimals',
                  query: { zooId: zoo.zooId },
                }"
              >
                ViewZoo
              </nuxt-link>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const Zoos = ref();
const token = useCookie("auth");
const openModal = ref(false);
const opendeleteModal = ref(false);
const zooId = ref(null);
const selectedZoo = ref(null);
const openUpdateModal = ref(false);
const deletedAlert = ref(false);
const updateAlert = ref(false);
const addAlert = ref(false);

console.log("Zoos Object Is ", Zoos);
// console.log("Zoos VAlue  Is ", Zoos.zooName);

const deletedAertClose = () => {
  deletedAlert.value = false;
};

const handleUpdateAlert = () => {
  updateAlert.value = true;
};

const closeUpdateAlert = () => {
  updateAlert.value = false;
};

const handleAddZooAlert = () => {
  addAlert.value = true;
};

const closeAddAlert = () => {
  addAlert.value = false;
};

const getZooId = (zoo) => {
  zooId.value = zoo.zooId;
};
console.log("ZooId Is ", zooId);

function onClick(zoo) {
  openUpdateModal.value = true;
  selectedZoo.value = zoo;
}

const deleteZooHandler = (zoo) => {
  getZooId(zoo);
  opendeleteModal.value = true;
};
const afterDelete = () => {
  deletedAlert.value = true;
};

watch(zooId, (newVal) => {
  console.log("Updated Zoo ID:", newVal);
});

const fetchZoo = async () => {
  const data = await $fetch(
    `http://localhost:8080/api/zoo/all??page=0&size=3`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  Zoos.value = data.content;

  // console.log("Feteched Data is ", data.content[0].zooName);
};

console.log("Zoo Id Value Is", zooId);
const deleteZoo = async () => {
  if (zooId.value) {
    try {
      await $fetch(`http://localhost:8080/api/zoo/del/${zooId.value}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      // Remove the deleted zoo from the list after deletion
      Zoos.value = Zoos.value.filter((zoo) => zoo.zooId !== zooId.value);
      opendeleteModal.value = false; // Close the delete modal
      afterDelete();
    } catch (error) {
      console.error("Error deleting zoo:", error);
    }
  }
};

onBeforeMount(() => {
  fetchZoo();
});
</script>
