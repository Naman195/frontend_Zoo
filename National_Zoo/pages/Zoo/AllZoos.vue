<template>
  <!-- ........................... heading Section ............................. -->
  <div class="max-w-full mx-auto text-center pt-7 relative">
    <h1
      class="text-4xl font-bold text-gray-900 leading-tight mb-2 pb-4 relative center"
    >
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
        >List Of Zoo</span
      >
      <span
        class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"
      ></span>
    </h1>
    <button
      v-if="useAuth().isAdmin && Zoos?.length > 0"
      class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 absolute top-7 right-7"
      type="button"
      @click="openModal = true"
    >
      Add Zoo
    </button>
  </div>

  <div class="flex flex-col items-center mx-auto pt-8">
    <div class="w-30">
      <SearchBar
        v-if="!isLoading && filteredZoos.length !== 0"
        @search="performSearch"
        @clear="resetSearch"
      />

      <div v-if="isSearching">
        <h1 v-if="filteredZoos.length === 0" class="text-gray-500 text-center">
          <p class="font-bold">No Result Found!</p>
        </h1>
      </div>

      <div
        v-if="
          !isLoading &&
          filteredZoos?.length === 0 &&
          currentPage === 0 &&
          !isSearching
        "
        class="flex flex-col justify-items-center items-center mt-5"
      >
        <h1 class="text-bold">
          <p class="font-bold">No Zoo Found! Please Add Zoo</p>
        </h1>
        <div>
          <button
            v-if="useAuth().isAdmin"
            class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-6"
            type="button"
            @click="openModal = true"
          >
            Add Zoo
          </button>
        </div>
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

      <div v-if="opendeleteModal" class="z-50 absolute top-1/2">
        <Modal
          :message="'Zoo'"
          @delete-user="deleteZoo"
          @close-modal="opendeleteModal = false"
        />
      </div>

      <div v-if="updatedformData && openModal" class="z-50 absolute top-1/2">
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

      <div v-if="selectedZoo && openUpdateModal" class="z-50 absolute top-1/2">
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
        <li
          v-for="(zoo, id) in filteredZoos"
          :key="`${zoo.zooId}-${zoo.image}`"
          class="m-4 list-none"
        >
          <ZooCard
            :entity-data="zoo"
            @delete="deleteZooHandler"
            @update="updateZoo(zoo)"
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
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PaginatedResponse } from "~/types/PaginationResponse";
import type { Zoo } from "~/types/Zoo";

const { showToast } = useToastNotify();

const selectedZoo = ref<Zoo | null>(null);
const Zoos = ref<Zoo[]>([]);
const filteredZoos = ref<Zoo[]>([]);
const isSearching = ref(false);
const zooId = ref<number>();
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(3);
const opendeleteModal = ref(false);
const openUpdateModal = ref(false);
const openModal = ref(false);
const isLoading = ref(true);
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
  image: null,
});

let compareUpdatedformData = {};

const changePage = (page: number) => {
  if (currentPage.value == page) {
    return;
  }
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchZoo(currentPage.value, pageSize.value);
  }
};

const getZooId = (id: number | undefined) => {
  zooId.value = id;
};

const deleteZooHandler = (id: number | undefined) => {
  getZooId(id);

  opendeleteModal.value = true;
};

function intiliazeFormData() {
  (updatedformData.value.zooName = ""),
    (updatedformData.value.address.street = ""),
    (updatedformData.value.address.zipCode = ""),
    (updatedformData.value.address.city.cityId = null),
    (updatedformData.value.address.city.state.stateId = null),
    (updatedformData.value.address.city.state.country.countryId = null);
  updatedformData.value.image = null;
}

function updateZoo(zoo: Zoo) {
  openUpdateModal.value = true;
  zooId.value = zoo.zooId;
  selectedZoo.value = zoo;

  compareUpdatedformData = { ...zoo };
  compareUpdatedformData = JSON.parse(JSON.stringify(compareUpdatedformData));
}

const fetchZoo = async (page = currentPage.value, size = pageSize.value) => {
  try {
    isLoading.value = true;
    const data = await $fetch<PaginatedResponse<Zoo>>(`/api/zoo/fetchZoo`, {
      params: {
        page: page,
        size: size,
      },
    });
    Zoos.value = data.content;
    filteredZoos.value = [...Zoos.value];
    totalPages.value = data.totalPages;
    isSearching.value = false;
  } catch (error) {
    console.error("Error fetching zoos:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteZoo = async () => {
  try {
    const data = await $fetch<string>(`/api/zoo/deleteZoo`, {
      method: "PATCH",
      params: {
        zooId: zooId.value,
      },
    });

    if (filteredZoos.value.length == 1 && currentPage.value > 0) {
      currentPage.value -= 1;
      fetchZoo(currentPage.value, pageSize.value);
    } else {
      fetchZoo(currentPage.value, pageSize.value);
    }
    opendeleteModal.value = false;
    showToast(data, "green");
  } catch (error: any) {
    showToast("Error Occur in delete Zoo", "red");
  }
};

const addZoo = async () => {
  try {
    const formData = new FormData();
    formData.append(
      "zoo",
      JSON.stringify({
        zooName: updatedformData.value.zooName,
        address: {
          street: updatedformData.value.address.street,
          zipCode: updatedformData.value.address.zipCode,
          city: {
            cityId: updatedformData.value.address.city.cityId,
          },
        },
      })
    );
    if (updatedformData.value.image) {
      console.log("Type of oimage Upload", updatedformData.value.image);

      formData.append("file", updatedformData.value.image);
    }
    const response = await $fetch<string>(`/api/zoo/addZoo`, {
      method: "POST",
      body: formData,
    });

    openModal.value = false;
    intiliazeFormData();
    showToast(response, "green");
    fetchZoo(currentPage.value, pageSize.value);
  } catch (error: any) {
    showToast("Error occured in adding zoo", "red");
  }
};

const updateZooHandler = async (formData: Zoo) => {
  console.log("Updated Inmage", formData);

  if (JSON.stringify(formData) == JSON.stringify(compareUpdatedformData)) {
    return;
  }
  try {
    const formDataNew = new FormData();
    formDataNew.append(
      "zoo",
      JSON.stringify({
        zooName: formData.zooName,
        address: {
          street: formData.address.street,
          zipCode: formData.address.zipCode,
          city: {
            cityId: formData.address.city.cityId,
          },
        },
      })
    );
    if (formData.image) {
      formDataNew.append("file", formData.image);
    }

    const response = await $fetch(`/api/zoo/updateZoo`, {
      method: "PATCH",
      params: {
        zooId: zooId.value,
      },
      body: formDataNew,
    });

    openUpdateModal.value = false;
    intiliazeFormData();
    showToast("Zoo Update SuccessFully", "green");
    fetchZoo(currentPage.value, pageSize.value);
  } catch (error) {
    showToast("Error Occur in Updating Zoo", "red");
  }
};

const resetSearch = () => {
  fetchZoo(currentPage.value, pageSize.value);
};

const performSearch = async (searchQuery: string) => {
  const trimmedQuery = searchQuery.trim();
  if (!trimmedQuery) {
    return;
  }
  try {
    const data = await $fetch<Zoo[]>(`/api/zoo/search`, {
      params: {
        searchQuery: trimmedQuery,
      },
    });
    filteredZoos.value = data;
    isSearching.value = true;
  } catch (error) {
    console.log("Error in Searching Zoo", error);
  }
};

onMounted(() => {
  fetchZoo(currentPage.value, pageSize.value);
});
</script>
