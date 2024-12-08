<template>
  <div class="flex flex-col items-center">
    <div  class="absolute top-0 end-0">
      <ShowAlert
        :alert-message="toastMessage"
        :is-visible="isToastVisible"
        @close-modal="closeToast"
      />
    </div>
    <div class="flex justify-between items-center w-full mb-6">
      <h1 class="flex-grow text-center font-semibold">All Zoo</h1>

      <button
        v-if="isAdmin && Zoos?.length > 0"
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
        type="button"
        @click="openModal = true"
      >
        Add Zoo
      </button>
    </div>

    <div class="w-full max-w-6xl px-4">

      <SearchBar  @search="performSearch" @clear="resetSearch" />
    
    <div v-if="isSearching">
      <h1 v-if="filteredZoos.length === 0" class="text-gray-500 text-center">
        <p class="font-bold">
        No Result Found!
        </p>
      </h1>
    </div>

    <div v-if="Zoos?.length === 0 && currentPage === 0 && !isSearching"
      class="flex justify-items-center justify-around mt-5"
    >
      <h1 class="text-bold"><p class="font-bold">
        No Zoo Found! Please Add Zoo
      </p> </h1>
      <div>
        <button v-if="isAdmin"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
          type="button"
          @click="openModal = true"
        >
          Add Zoo
        </button>
      </div>
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
        :modal-title="'Add Zoo'"
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
        :modal-title="'Update Zoo'"
        :submit-button-label="'Update Zoo'"
        :from-data="selectedZoo"
        :update-click="false"
        @save="updateZooHandler"
        @close="
          openUpdateModal = false;
          intiliazeFormData();
        "
      />
    </div>

    <!-- Display All Zoos -->
    <div class="flex flex-wrap justify-center">
      <li v-for="(zoo, id) in filteredZoos" :key="id" class="m-4 list-none "> <!-- w-full sm:w-[48%] lg:w-[30%]-->
        <ShowCards
          :entity-data="zoo"
          cardName="animal"
          @delete="deleteZooHandler"
          @update="updateZoo(zoo)"
        
          
          delete-button-label="Delete Zoo"
          update-button-label="Update Zoo"
          view-button-label="view Zoo"
        />
      </li>
    </div>
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
const toastMessage =  ref("");
const isToastVisible = ref(false);
const selectedZoo = ref({});
const Zoos = ref();
const filteredZoos = ref([]);
const isSearching = ref(false);
const zooId = ref(null);
const isAdmin = ref(false);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(3);
const opendeleteModal = ref(false);
const openModal = ref(false);
const openUpdateModal = ref(false);
const token = useCookie('auth');
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

let compareUpdatedformData = {};


const closeToast = () => {
  isToastVisible.value = false;
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

function updateZoo(zoo) {
  openUpdateModal.value = true;
  zooId.value = zoo.zooId;
  selectedZoo.value = zoo;
  compareUpdatedformData = {...zoo }
  compareUpdatedformData = JSON.parse(JSON.stringify(compareUpdatedformData));
 
}

const fetchZoo = async (page = currentPage.value, size = pageSize.value) => {
  try {
    const data = await useCustomFetch(`/zoo/all?page=${page}&size=${size}`);
    Zoos.value = data.content; 
    filteredZoos.value = [...Zoos.value]; 
    totalPages.value = data.totalPages;
    isSearching.value = false;

  } catch (error) {
    console.error("Error fetching zoos:", error);
  }
};


const deleteZoo = async () => {
  try {
    const data = await useCustomFetch(`/zoo/del/${zooId.value}`, {
      method: "PATCH",
    });
    Zoos.value = Zoos.value.filter((zoo) => zoo.zooId !== zooId.value);
    filteredZoos.value = Zoos.value;
    opendeleteModal.value = false;
    toastMessage.value = data;
    isToastVisible.value = true;
    
    if (filteredZoos.value.length === 0 && currentPage.value > 0) {
      currentPage.value -= 1;
      fetchZoo(currentPage.value, pageSize.value);
    } 
    
  } catch (error) {
    console.error("Error deleting zoo:", error);
    toastMessage.value = error;
    isToastVisible.value = true;
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
    toastMessage.value = response;
    isToastVisible.value = true;
    fetchZoo(currentPage.value, pageSize.value);
  } catch (error) {
    console.log("Error in Adding Zoo", error);
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const updateZooHandler = async (formData) => {
  console.log(("From Data from Update Modal", formData));

  const data = (JSON.stringify(formData));
  console.log("After Update", data);
  
  const data2 = JSON.stringify(compareUpdatedformData);
  console.log(data2);
  // console.log(JSON.stringify(formData) ==
  // JSON.stringify(compareUpdatedformData));
  if((JSON.stringify(formData) ==
  JSON.stringify(compareUpdatedformData)) ){
    return;
  }
  const resBody = {
    zooName: formData.zooName,
    address: {
      street: formData.address.street,
      zipCode: formData.address.zipCode,
      city: {
        cityId: formData.address.city.cityId,
      },
    },
  };
  
  try {
    const response = await useCustomFetch(`/zoo/update/${zooId.value}`, {
      method: "PATCH",
      body: resBody,
    });
    openUpdateModal.value = false;
    intiliazeFormData();
    toastMessage.value = "Zoo Update SuccessFully";
    isToastVisible.value = true;
    fetchZoo(currentPage.value, pageSize.value);
  } catch (error) {
    toastMessage.value = error;
    isToastVisible.value = true;
  }
};

const resetSearch = () => {
  fetchZoo(currentPage.value, pageSize.value);
}

const performSearch = async (searchQuery) => {  
  const trimmedQuery = searchQuery.trim();
  if (!trimmedQuery) {
    return;
  }
    try {
      const data = await useCustomFetch(
      `/zoo/search?searchItem=${trimmedQuery}`
    );

    filteredZoos.value = data;
    isSearching.value = true;
      
    } catch (error) {
      console.log("Error in Searching Zoo", error);
      
    }
   
  }


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


onMounted(() => {
  fetchZoo(currentPage.value, pageSize.value);
});
</script>
