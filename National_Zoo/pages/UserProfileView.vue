<template>
  <div v-if="isUpdateModalVisible">
    <AddZoo
      :from-data="updatedformData"
      :update-click="true"
      :modal-title="'User Profile'"
      :submit-button-label="'Update Profile'"
      @save="updateUser"
      @close="isUpdateModalVisible = false"
    />
  </div>
  <h1 class="text-4xl font-bold text-center my-6 text-gray-800">
    User Profile
  </h1>
  <section class="container mx-auto p-6 md:p-12 antialiased">
    <article
      class="flex flex-wrap md:flex-nowrap shadow-lg mx-auto max-w-4xl bg-blue-100 rounded-lg overflow-hidden group cursor-pointer transform duration-300 hover:shadow-xl"
    >
      <img
        class="w-full max-h-[400px] object-cover md:w-1/3"
        :src="imageUrl"
        alt="User Image"
      />
      <div class="flex-1 p-6 md:p-10">
        <h2 class="text-3xl font-semibold text-gray-700 mb-6">User Info</h2>
        <div class="space-y-4 text-gray-600">
          <p class="text-lg">
            <span class="font-bold">Name:</span>
            {{ userProfile?.fullName }}
          </p>
          <p class="text-lg">
            <span class="font-bold">Email:</span>
            {{ userProfile?.email }}
          </p>
          <p class="text-lg">
            <span class="font-bold">Username:</span>
            {{ userProfile?.username }}
          </p>
          <p class="text-lg">
            <span class="font-bold">Street:</span>
            {{ userProfile?.address.street }}
          </p>
        </div>

        <div class="mt-8">
          <button
            class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            @click="handleProfileModal"
          >
            Update Profile
          </button>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { User } from "~/types/User";

// const userProfile = useCookie<User>("user");
const userProfile = ref();
const filenameImage = ref("");
const imageUrl = ref("");

const isUpdateModalVisible = ref(false);

var updatedformData = ref({
  fullName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null as number | null,
      state: {
        stateId: null as number | null,
        country: {
          countryId: null as number | null,
        },
      },
    },
  },
  image: null as File | null,
});

let compareUserProfileData = {};

const handleProfileModal = () => {
  isUpdateModalVisible.value = true;

  updatedformData.value = { ...userProfile.value };
  compareUserProfileData = { ...userProfile.value };
  compareUserProfileData = JSON.parse(JSON.stringify(compareUserProfileData));
};

const fetchUserProfile = async () => {
  const data = await $fetch<User>("/api/userProfileview");

  userProfile.value = data;

  console.log("Data is ", data);
  imageUrl.value = `http://192.168.0.153:8081/${data.image}`;
};

const updateUser = async (formData: User) => {
  if (JSON.stringify(formData) == JSON.stringify(compareUserProfileData)) {
    return;
  }

  try {
    const formDataNew = new FormData();

    formDataNew.append(
      "userUpdate",
      JSON.stringify({
        fullName: formData.fullName,
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

    const data = await $fetch<User>(`/api/updateUser`, {
      method: "PATCH",

      body: formDataNew,
    });

    userProfile.value = data;

    isUpdateModalVisible.value = false;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

onBeforeMount(() => {
  fetchUserProfile();
});
</script>
