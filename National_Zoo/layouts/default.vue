<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-semibold">
        <NuxtLink to="/" class="hover:text-gray-300">National - Zoo</NuxtLink>
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
              >Zoo's</NuxtLink
            >
          </li>
          <!-- <li>
            <NuxtLink to="/allusers" class="hover:text-gray-300"
              >All users</NuxtLink
            >
          </li> -->
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
      v-if="isProfileVisible && userProfile"
      class="absolute right-0 mt-2 w-64 bg-white shadow-md p-4 rounded-lg"
    >
      <h2 class="font-bold text-lg">User Profile</h2>
      <p>
        <strong>Name:</strong> {{ userProfile.fullName }}
        {{ userProfile.lastName }}
      </p>
      <p><strong>City:</strong> {{ userProfile.address.city.cityName }}</p>

      <!-- Buttons container -->
      <div class="flex justify-between mt-4">
        <button
          @click="logoutUser"
          class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
        >
          Logout
        </button>
        <button
          @click="
            () => {
              toggleUpdateModal();
              fillupdateFormData();
              fetchCountries();
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
      <AddZoo :from-data="form" :update-click="true" />
    </div>
    <!-- Main modal for updating profile -->

    <!-- <cuctom :name = /> -->
    <!-- ......new .... -->
  </nav>

  <div v-if="updateAlert" class="absolute top-30 end-0">
    <ShowAlert
      :alert-message="'User Updated  Successfully'"
      @close-modal="closeUpdateAlert"
    />
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup>
// import "../assests/css/Navbar.css";
import { ErrorMessage, Field, Form } from "vee-validate";
import "../assests/css/style.css";
import { useAuth } from "~/composables/useAuth";
import { useUserProfile } from "~/composables/useUserProfile";

const router = useRouter();
const { isLoggedIn, logOut } = useAuth();
const { userProfile, setUser, getUser } = useUserProfile();
const userToken = useCookie("isLoggedIn");
const isProfileVisible = ref(false);
const isUpdateModalVisible = ref(false);
const updateAlert = ref(false);

const afterUpdate = () => {
  updateAlert.value = true;
};

const closeUpdateAlert = () => {
  updateAlert.value = false;
};

const logoutUser = () => {
  logOut();
  router.push("/userlogin");
  isProfileVisible.value = false;
};

const toggleProfile = () => {
  isProfileVisible.value = !isProfileVisible.value;
};

const toggleUpdateModal = () => {
  isUpdateModalVisible.value = !isUpdateModalVisible.value;
  isProfileVisible.value = false;
  console.log("User LoggedIn data", userProfile);
};

const fillupdateFormData = () => {
  // console.log("Running..");

  form.fullName = userProfile.value.fullName;
  // form.email = userProfile.value.email;
  form.address.street = userProfile.value.address.street;
  form.address.zipCode = userProfile.value.address.zipCode;
  selectedCountry.value =
    userProfile.value.address.city.state.country.countryId;
  selectedState.value = userProfile.value.address.city.state.stateId;
  form.address.city.cityId = userProfile.value.address.city.cityId;
  fetchStates();
  fetchCities();
};

// Fetch User Profile
const user = ref(null);
const userId = useCookie("userId");

onBeforeMount(() => {
  if (userToken.value == true) {
    // getUser();
    fetchProfile();
    // fetchCountries();
  }
});

// Handle Update Profile Logic
// const form = reactive({
//   fullName: "",
//   address: {
//     street: "",
//     zipCode: "",
//     city: {
//       cityId: null,
//     },
//   },
// });

const form = ref({
  fullName: "",
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

const fetchProfile = async () => {
  try {
    const fetchedUser = await useCustomFetch(`/auth/user/${userId.value}`);
    userProfile.value = fetchedUser;
    setUser(fetchedUser);
  } catch (error) {
    console.error("Error fetching User:", error);
  }
};

const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);

const fetchCountries = async () => {
  try {
    const data = await useCustomFetch(`/auth/countries`);
    countries.value = data;
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const handleCountryChange = () => {
  if (selectedCountry.value) {
    fetchStates();
  }
};

const fetchStates = async () => {
  if (!selectedCountry.value) return;
  try {
    const data = await useCustomFetch(`/auth/state/${selectedCountry.value}`);
    states.value = data;
  } catch (error) {
    console.error("Error fetching States:", error);
  }
};

const handleStateChange = () => {
  if (selectedState.value) {
    fetchCities();
  }
};

const fetchCities = async () => {
  try {
    const data = await useCustomFetch(`/auth/cities/${selectedState.value}`);
    cities.value = data;
  } catch (error) {
    console.error("Error fetching Cities:", error);
  }
};

const updateUser = async () => {
  try {
    await useCustomFetch(`/auth/userupdate/${userId.value}`, {
      method: "PATCH",
      body: form,
    });
    setUser(form);
    afterUpdate();

    toggleUpdateModal();
    // router.push("/");
  } catch (err) {
    console.error("Error updating user:", err);
  }
};
</script>
