<template>
  <div class="">
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center font-semibold">All Zoo</h1>

      <button
        v-if="Zoos?.length !== 0"
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
        type="button"
        @click="openModal = true"
      >
        Add Zoo
      </button>
    </div>

    <SearchBar @results="updateZooList" />
    <div v-if="isSearching">
      <p v-if="filteredZoos.length === 0" class="text-gray-500 text-center">
        <h1 class="font-bold">
        No Result Found!
      </h1>
      </p>
    </div>

    <div v-if="Zoos?.length === 0"
      class="grid grid-cols-1 gap-15 justify-items-center p-2 max-w-md mt-10 space-x"
    >
      <p class="text-bold"><h1 class="font-bold">
        No Zoo Found! Please Add Zoo
      </h1> </p>
      <div>
        <button
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
          type="button"
          @click="openModal = true"
        >
          Add Zoo
        </button>
      </div>
    </div>

    <div v-if="deletedAlert" class="absolute top-30 end-0">
      <ShowAlert
        :alert-message="deleteAlertMessageSet()"
        @close-modal="deletedAertClose"
      />
    </div>
    <div v-if="addAlert" class="absolute top-30 end-0">
      <ShowAlert
        :alert-message="addAlertMessageSet()"
        @close-modal="addAlertClose"
      />
    </div>

    <div v-if="updateAlert" class="absolute top-30 end-0">
      <ShowAlert
        :alert-message="handleUpdateAlert()"
        @close-modal="updateAlertClose"
      />
    </div>

    <div v-if="opendeleteModal" class="z-50 absolute top-1/2">
      <Modal
        :message="'Zoo'"
        @delete-user="deleteZoo"
        @close-modal="opendeleteModal = false"
      />
    </div>

    <div v-if="openModal" class="z-50 absolute top-1/2">
      <AddZoo
        :modal-title="'Add'"
        :submit-button-label="'Add Zoo'"
        :from-data="updatedformData"
        :update-click="false"
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
        :update-click="false"
        @save="updateZoo"
        @close="
          openUpdateModal = false;
          intiliazeFormData();
        "
      />
    </div>

    <!-- Display All Zoos -->
    <div class="flex flex-wrap justify-center">
      <li v-for="(zoo, id) in filteredZoos" :key="id" class="m-4 list-none">
        <ShowCards
          :entity-data="zoo"
          :zooId="nextZooId"
          cardName="animal"
          @delete="deleteZooHandler"
          @update="onClick(zoo)"
          delete-button-label="Delete Zoo"
          update-button-label="Update Zoo"
          view-button-label="view Zoo"
        />
      </li>
    </div>
    <div v-if="!isSearching && filteredZoos.length !== 0">
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        @update:currentPage="changePage"
        @fetch-data="fetchZoo"
      />
    </div>
  </div>
</template>

<script setup>
const Zoos = ref();
const filteredZoos = ref([]);
const isSearching = ref(false);
const id = ref(null);
const zooId = ref(null);
const nextZooId = ref(0);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(3);
const deletedAlert = ref(false);
const deleteAlertMessage = ref("");
const addAlert = ref(false);
const addAlertMessage = ref("");
const updateAlert = ref(false);
const updateAlertMessage = ref("");
const opendeleteModal = ref(false);
const openModal = ref(false);
const openUpdateModal = ref(false);
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
          countryId: null,
        },
      },
    },
  },
});

const compareUpdatedformData = ref({
  zooName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
      state: {
        stateId: null,
        country: {
          countryId: null,
        },
      },
    },
  },
});

const deletedAertClose = () => {
  deletedAlert.value = false;
};
const afterDelete = () => {
  deletedAlert.value = true;
};

const deleteAlertMessageSet = () => {
  return deleteAlertMessage;
};

const addAlertMessageSet = () => {
  return addAlertMessage;
};

const afterAdd = () => {
  addAlert.value = true;
};

const addAlertClose = () => {
  addAlert.value = false;
};

const afterUpdate = () => {
  updateAlert.value = true;
};

const updateAlertClose = () => {
  updateAlert.value = false;
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchZoo(currentPage.value, pageSize.value);
  }
};

const getZooId = (id) => {
  zooId.value = id;
};

const deleteZooHandler = (id) => {
  getZooId(id);
  console.log("Zoo Id is", id);

  opendeleteModal.value = true;
};

const handleUpdateAlert = () => {
  return updateAlertMessage;
};

function intiliazeFormData() {
  (updatedformData.value.zooName = ""),
    (updatedformData.value.address.street = ""),
    (updatedformData.value.address.zipCode = ""),
    (updatedformData.value.address.city.cityId = ""),
    (updatedformData.value.address.city.state.stateId = ""),
    (updatedformData.value.address.city.state.country.countryId = "");
}

const formDataChanged = () => {
  return (
    JSON.stringify(updatedformData.value) !==
    JSON.stringify(compareUpdatedformData.value)
  );
};

function onClick(zoo) {
  console.log("Update Zoo Object is", zoo);

  openUpdateModal.value = true;

  zooId.value = zoo.zooId;
  id.value = zoo.zooId;
  updatedformData.value.zooName = zoo.zooName;
  updatedformData.value.address.zipCode = zoo.address.zipCode;
  updatedformData.value.address.street = zoo.address.street;
  updatedformData.value.address.city.cityId = zoo.address.city.cityId;
  updatedformData.value.address.city.state.stateId =
    zoo.address.city.state.stateId;
  updatedformData.value.address.city.state.country.countryId =
    zoo.address.city.state.country.countryId;
  compareUpdatedformData.value.zooName = zoo.zooName;
  compareUpdatedformData.value.address.zipCode = zoo.address.zipCode;
  compareUpdatedformData.value.address.street = zoo.address.street;
  compareUpdatedformData.value.address.city.cityId = zoo.address.city.cityId;
  compareUpdatedformData.value.address.city.state.stateId =
    zoo.address.city.state.stateId;
  compareUpdatedformData.value.address.city.state.country.countryId =
    zoo.address.city.state.country.countryId;
}

const fetchZoo = async (page = currentPage.value, size = pageSize.value) => {
  try {
    const data = await useCustomFetch(`/zoo/all?page=${page}&size=${size}`);
    Zoos.value = data.content; // Reactive assignment
    filteredZoos.value = [...Zoos.value]; // Ensure reactivity
    totalPages.value = data.totalPages;
    isSearching.value = false;
    // console.log("Updated filteredZoos in fetchZoo:", filteredZoos.value);
  } catch (error) {
    console.error("Error fetching zoos:", error);
  }
};

const updateZooList = (results) => {
  isSearching.value = true;
  filteredZoos.value = [...results.value];
};

const deleteZoo = async () => {
  try {
    const data = await useCustomFetch(`/zoo/del/${zooId.value}`, {
      method: "PATCH",
    });
    Zoos.value = Zoos.value.filter((zoo) => zoo.zooId !== zooId.value);
    filteredZoos.value = Zoos.value;
    opendeleteModal.value = false;
    deleteAlertMessage.value = data;
    afterDelete();
  } catch (error) {
    console.error("Error deleting zoo:", error);
  }
};

const addZoo = async () => {
  const resbody = {
    zooName: updatedformData.value.zooName,
    address: {
      street: updatedformData.value.address.street,
      zipCode: updatedformData.value.address.zipCode,
      city: {
        cityId: updatedformData.value.address.city.cityId,
      },
    },
  };

  try {
    const response = await useCustomFetch(`/zoo/create-zoo`, {
      method: "POST",
      body: resbody,
    });
    openModal.value = false;
    intiliazeFormData();
    // console.log(response);
    addAlertMessage.value = response;
    afterAdd();
    fetchZoo(currentPage.value, pageSize.value);
  } catch (error) {
    console.log("Error in Adding Zoo", error);
    addAlertMessage.value = error;
  }
};

const updateZoo = async () => {
  if (!formDataChanged()) {
    return;
  }
  const resBody = {
    zooName: updatedformData.value.zooName,
    address: {
      street: updatedformData.value.address.street,
      zipCode: updatedformData.value.address.zipCode,
      city: {
        cityId: updatedformData.value.address.city.cityId,
      },
    },
  };
  try {
    const response = await useCustomFetch(`/zoo/update/${zooId.value}`, {
      method: "PATCH",
      body: resBody,
    });

    console.log("response", response);
    openUpdateModal.value = false;
    intiliazeFormData();
    updateAlertMessage.value = "Zoo Update SuccessFully";
    handleUpdateAlert();
    afterUpdate();
    // fetchZoo();
    fetchZoo(currentPage.value, pageSize.value);
  } catch (error) {
    updateAlertMessage.value = error;
    console.error("Error updating zoo:", error);
    handleUpdateAlert();
  }
};

onMounted(() => {
  fetchZoo(currentPage.value, pageSize.value);
});
</script>
