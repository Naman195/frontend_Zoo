<template>
  <!--  -->
  <nav class="bg-gray-800 p-4 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-semibold">
        <NuxtLink to="/" class="hover:text-gray-300">
          <img
            src="../assests/images/zooicon.png"
            alt="Profile"
            class="h-10 w-10 rounded-full"
          />
        </NuxtLink>
      </div>
      <ul class="flex items-center space-x-6 text-white">
        <li><NuxtLink to="/" class="hover:text-gray-300">Home</NuxtLink></li>

        <template v-if="!userToken">
          <li>
            <NuxtLink
              to="/userlogin"
              class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >SignIn</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/userregisteration"
              class="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >SignUp</NuxtLink
            >
          </li>
        </template>
        <template v-else>
          <li>
            <NuxtLink to="/zoo/allzoos" class="hover:text-gray-300"
              >All Zoo</NuxtLink
            >
          </li>

          <li>
            <NuxtLink to="/UserProfileView" class="hover:text-gray-300"
              >User Profile</NuxtLink
            >
          </li>
          <li class="cursor-pointer" @click="toggleProfile">
            <img
              src="../assests/images/user.png"
              alt="Profile"
              class="h-8 w-8 rounded-full"
            />
          </li>
        </template>
      </ul>
    </div>

    <div
      v-if="isProfileVisible"
      class="absolute right-0 mt-2 w-64 bg-white shadow-md p-4 rounded-lg z-50"
    >
      <h2 class="font-bold text-lg">User Profile</h2>
      <p><strong>Name:</strong> {{ userProfile.fullName }}</p>
      <p>
        <strong>City:</strong>
        {{ userProfile.address.city.cityName }}
      </p>

      <!-- Buttons container -->
      <div class="flex justify-between mt-4">
        <button
          @click="logoutUser()"
          class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
        >
          Logout
        </button>
        <button
          @click="
            () => {
              handleProfileModal();
            }
          "
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update Profile
        </button>
      </div>
    </div>
    <!-- Use Modal for Update Profile -->
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
  </nav>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useToastNotify } from "~/composables/useToastNotify";

import "../assests/css/style.css";
import { useAuth } from "~/composables/useAuth";
import { useUserStore } from "~/store/user";
import type { User } from "~/types/User";

const { showToast } = useToastNotify();
const router = useRouter();
const { logOut } = useAuth();
const userToken = useCookie("isLoggedIn");
const isProfileVisible = ref(false);
const isUpdateModalVisible = ref(false);
const userStore = useUserStore();
const userProfile = useCookie<User>("user");

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

const logoutUser = async () => {
  console.log("Logout User");

  const res = await useCustomFetch("/auth/logout", {
    method: "POST",
  });

  userStore.removeUser();
  logOut();
  router.push("/userlogin");
  isProfileVisible.value = false;
};

const toggleProfile = () => {
  isProfileVisible.value = !isProfileVisible.value;
};

let compareUserProfileData = {};

const handleProfileModal = () => {
  isUpdateModalVisible.value = true;
  isProfileVisible.value = false;
  updatedformData.value = { ...userProfile.value };
  compareUserProfileData = { ...userProfile.value };
  compareUserProfileData = JSON.parse(JSON.stringify(compareUserProfileData));
};

// Fetch User Profile
const userId = useCookie("userId");

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

    const data = await useCustomFetch<User>(`/auth/update/${userId.value}`, {
      method: "PATCH",
      body: formDataNew,
    });

    userStore.setUser(data);
    const userCookie = useCookie("user");
    userCookie.value = JSON.stringify(data);

    isUpdateModalVisible.value = false;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
</script>
