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
      <p><strong>Name:</strong> Naman Arora</p>
      <p>
        <strong>City:</strong>
        Noida
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
          @click="viewProfile"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          View Profile
        </button>
      </div>
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

const { showToast } = useToastNotify();
const router = useRouter();
const { logOut } = useAuth();
const userToken = useCookie("isLoggedIn");
const isProfileVisible = ref(false);
const viewProfile = () => {
  router.push("/userprofileview");
  isProfileVisible.value = false;
};

const logoutUser = async () => {
  const res = await $fetch("/api/logout", {
    method: "POST",
  });
  logOut();
  router.push("/userlogin");
  isProfileVisible.value = false;
};

const toggleProfile = () => {
  isProfileVisible.value = !isProfileVisible.value;
};
</script>
