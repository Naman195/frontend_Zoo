<template>
  <div class="flex flex-col items-center">
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center font-semibold">All Zoo</h1>

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

    <!-- Display All Zoos -->
    <div class="flex flex-wrap justify-center">
      <li v-for="(zoo, id) in Zoos" :key="id" class="m-4 list-none">
        <ShowCards
          :entity-data="zoo"
          :zooId="nextZooId"
          cardName="animal"
          @delete="deleteZooHandler"
          @update="onClick(zoo)"
        />
      </li>
    </div>
    
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :pageSize="pageSize"
      @update:currentPage="changePage"
      @fetch-data="fetchZoo"
    />

  </div>
</template>

<script setup>
const Zoos = ref();
const id = ref(null);
const zooId = ref(null);
const nextZooId = ref(0);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(3);
const deletedAlert = ref(false);
const deleteAlertMessage = ref("");
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
    Zoos.value = data.content;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error("Error fetching zoos:", error);
  }
};

const deleteZoo = async () => {
  //   if (zooId.value) {
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
};
// };

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
  } catch (error) {
    console.log("Error in Adding Zoo", error);
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
    fetchZoo();
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
