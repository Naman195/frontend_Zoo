<template>
  <div class="bg-gradient-to-b from-blue-200 to-blue-500 min-h-screen py-10">
    {{ updatedformData }}
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center">All Zoo</h1>
      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
        type="button"
        @click="
          () => {
            openModal = true;
          }
        "
      >
        Add Zoo
      </button>
    </div>
    <div v-if="deletedAlert" class="z-50 absolute top-1/2">
      <ShowAlert
        :alert-message="deleteAlertMessageSet()"
        @close-modal="deletedAertClose"
      />
    </div>

    <div v-if="updateAlert">
      <ShowAlert
        :alert-message="updateAlertMessageSet()"
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
      <AddZoo
        :modal-title="'Add'"
        :submit-button-label="'Add Zoo'"
        :from-data="updatedformData"
        @save="addZoo"
        @close="
          openModal = false;
          intiliazeFormData();
        "
      />
    </div>

    <div v-if="openUpdateModal" class="z-50 absolute top-1/2">
      <AddZoo
        :modal-title="'Update'"
        :submit-button-label="'Update Zoo'"
        :from-data="updatedformData"
        @save="updateZoo"
        @close="
          openUpdateModal = false;
          intiliazeFormData();
        "
      />
    </div>

    <div v-if="opendeleteModal" class="z-50 absolute top-1/2">
      <Modal
        :message="'Zoo'"
        @delete-user="deleteZoo"
        @close-modal="opendeleteModal = false"
      />
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
const deleteAlertMessage = ref("");
const updateAlertMessage = ref("");

const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(3);

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchZoo(currentPage.value, pageSize.value);
  }
};

const deleteAlertMessageSet = () => {
  return deleteAlertMessage;
};

const updateAlertMessageSet = () => {
  return updateAlertMessage;
};

const formData = ref({
  zooName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
    },
  },
});

const updatedformData = ref({
  zooName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
      state: {
        stateId: null,
        country: {
          countryId: null
        }
      }
    },
  },
}); 

function intiliazeFormData() {
  (formData.value.zooName = ""),
    (formData.value.address.street = ""),
    (formData.value.address.zipCode = ""),
    (formData.value.address.city.cityId = "");
}

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
  console.log("Update Zoo Object is", zoo);
  
  openUpdateModal.value = true;
  zooId.value = zoo.zooId;
  updatedformData.value.zooName = zoo.zooName;
  updatedformData.value.address.zipCode = zoo.address.zipCode;
  updatedformData.value.address.street = zoo.address.street;
  updatedformData.value.address.city.cityId = zoo.address.city.cityId;
  updatedformData.value.address.city.state.stateId = zoo.address.city.state.stateId
  updatedformData.value.address.city.state.country.countryId = zoo.address.city.state.country.countryId

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

const fetchZoo = async (page = currentPage.value, size = pageSize.value) => {
  try {
    const data = await useCustomFetch(`/zoo/all?page=${page}&size=${size}`);
    Zoos.value = data.content;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error("Error fetching zoos:", error);
  }
};

const deleteZoo = async () => {
  if (zooId.value) {
    try {
      const data = await useCustomFetch(`/zoo/del/${zooId.value}`, {
        method: "PATCH",
      });
      Zoos.value = Zoos.value.filter((zoo) => zoo.zooId !== zooId.value);
      opendeleteModal.value = false;
      deleteAlertMessage.value = data;
      afterDelete();
    } catch (error) {
      console.error("Error deleting zoo:", error);
    }
  }
};

const addZoo = async () => {
  const response = await useCustomFetch(`/zoo/create-zoo`, {
    method: "POST",
    body: {
      ...formData.value,
    },
  });
  openModal.value = false;
};

const updateZoo = async () => {
  try {
    const response = await useCustomFetch(`/zoo/update/${zooId.value}`, {
      method: "PATCH",
      body: {
        ...formData.value,
      },
    });

    console.log("response", response);
    openUpdateModal.value = false;
    updateAlertMessage.value = "Zoo Update SuccessFully";
    handleUpdateAlert();
    fetchZoo();
  } catch (error) {
    updateAlertMessage.value = error;
    console.error("Error updating zoo:", error);
    handleUpdateAlert();
  }
};

onMounted(() => {
  // fetchZoo();
  fetchZoo(currentPage.value, pageSize.value);
});
</script>
