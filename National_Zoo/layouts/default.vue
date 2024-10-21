<template>
 <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-semibold">
        <NuxtLink to="/" class="hover:text-gray-300">National - Zoo</NuxtLink>
      </div>
      <ul class="flex items-center space-x-6 text-white">
        <li><NuxtLink to="/" class="hover:text-gray-300">Home</NuxtLink></li>
        <li><NuxtLink to="#" class="hover:text-gray-300">About</NuxtLink></li>
        <li><NuxtLink to="#" class="hover:text-gray-300">Contact</NuxtLink></li>
        <template v-if="!userToken">
          <li>
            <NuxtLink to="/userlogin" class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">SignIn</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/userregisteration" class="bg-green-500 px-4 py-2 rounded hover:bg-green-600">SignUp</NuxtLink>
          </li>
        </template>
        <template v-else>
          <li class="cursor-pointer" @click="toggleProfile">
            <img src="../assests/images/user.png" alt="Profile" class="h-8 w-8 rounded-full" />
          </li>
        </template>
      </ul>
    </div>

    <!-- Profile Popup -->
    <!-- <div v-if="isProfileVisible" class="absolute right-0 mt-2 w-64 bg-white shadow-md p-4 rounded-lg">
      <h2 class="font-bold text-lg">User Profile</h2>
      <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>City:</strong> {{ user.address.city.cityName }}</p>
      <button @click="logoutUser" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      <button @click="toggleUpdateModal" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Update Profile</button>
    </div> -->

    <!-- <div> -->
    <!-- Profile Section new -->
    <!-- <div v-if="isProfileVisible" class="absolute right-0 mt-2 w-64 bg-white shadow-md p-4 rounded-lg">
      <h2 class="font-bold text-lg">User Profile</h2>
      <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>City:</strong> {{ user.address.city.cityName }}</p>
      <button @click="logoutUser" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      <button @click="toggleUpdateModal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
  Update Profile
</button>
    </div> -->

    <div v-if="isProfileVisible" class="absolute right-0 mt-2 w-64 bg-white shadow-md p-4 rounded-lg">
  <h2 class="font-bold text-lg">User Profile</h2>
  <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
  <p><strong>City:</strong> {{ user.address.city.cityName }}</p>
  
  <!-- Buttons container -->
  <div class="flex justify-between mt-4">
    <button @click="logoutUser" class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">
      Logout
    </button>
    <button @click="toggleUpdateModal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Update Profile
    </button>
  </div>
</div>


    <!-- Modal for Updating User Information -->
    <!-- <div v-if="isUpdateModalVisible" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 class="text-lg font-bold mb-4">Update Profile</h2>
        <form @submit.prevent="updateUser">
          <div class="mb-4">
            <label for="firstName" class="block text-sm font-medium">First Name</label>
            <input type="text" v-model="form.firstName" required class="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="lastName" class="block text-sm font-medium">Last Name</label>
            <input type="text" v-model="form.lastName" required class="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="country" class="block text-sm font-medium">Country</label>
            <select v-model="selectedCountry" @change="handleCountryChange" required class="mt-1 block w-full px-3 py-2 border rounded">
              <option v-for="country in countries" :key="country.countryId" :value="country.countryId">
                {{ country.countryName }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="state" class="block text-sm font-medium">State</label>
            <select v-model="selectedState" :disabled="!selectedCountry" @change="handleStateChange" required class="mt-1 block w-full px-3 py-2 border rounded">
              <option v-for="state in states" :key="state.stateId" :value="state.stateId">
                {{ state.stateName }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="city" class="block text-sm font-medium">City</label>
            <select v-model="form.address.city.cityId" :disabled="!selectedState" required class="mt-1 block w-full px-3 py-2 border rounded">
              <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                {{ city.cityName }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="street" class="block text-sm font-medium">Street</label>
            <input type="text" v-model="form.address.street" required class="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="zipCode" class="block text-sm font-medium">Zip Code</label>
            <input type="text" v-model="form.address.zipCode" required class="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div class="flex justify-end">
            <button type="button" @click="toggleUpdateModal" class="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
          </div>
        </form>
      </div>
    </div> -->

    <!-- NEw Modal -->
    <!-- Modal toggle -->


<!-- Main modal for updating profile -->
<div v-if="isUpdateModalVisible" tabindex="-1" aria-hidden="true" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Update Profile
                </h3>
                <button type="button" @click="toggleUpdateModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5">
                <form @submit.prevent="updateUser" class="space-y-4">
                    <!-- First Name Field -->
                    <div>
                        <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                        <input type="text" v-model="form.firstName" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <!-- Last Name Field -->
                    <div>
                        <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                        <input type="text" v-model="form.lastName" id="lastName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <!-- Country Select -->
                    <div>
                        <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                        <select v-model="selectedCountry" @change="handleCountryChange" id="country" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                          <option v-for="country in countries" :key="country.countryId" :value="country.countryId">
                            {{ country.countryName }}
                          </option>
                        </select>
                    </div>
                    <!-- State Select -->
                    <div>
                        <label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                        <select v-model="selectedState" @change="handleStateChange" id="state" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                          <option v-for="state in states" :key="state.stateId" :value="state.stateId">
                            {{ state.stateName }}
                          </option>
                        </select>
                    </div>
                    <!-- City Select -->
                    <div>
                        <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                        <select v-model="form.address.city.cityId" id="city" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                          <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                            {{ city.cityName }}
                          </option>
                        </select>
                    </div>
                    <!-- Street Input -->
                    <div>
                        <label for="street" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Street</label>
                        <input type="text" v-model="form.address.street" id="street" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <!-- Zip Code Input -->
                    <div>
                        <label for="zipCode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zip Code</label>
                        <input type="text" v-model="form.address.zipCode" id="zipCode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <!-- Buttons -->
                    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Update Profile
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

    <!-- ......new .... -->
  </nav>
  <div>
    <slot />
  </div>
</template>

<script setup>
import "../assests/css/Navbar.css";
import "../assests/css/style.css";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { isLoggedIn, logOut } = useAuth();
const userToken = useCookie("isLoggedIn");
const isProfileVisible = ref(false);
const isUpdateModalVisible = ref(false);

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
  isProfileVisible.value =  false;
};

// Fetch User Profile
const user = ref(null);
const userId = useCookie("userId");

const fetchProfile = async () => {
  try {
    const fetchedUser = await $fetch(`http://localhost:8080/api/zoo/users/${userId.value}`);
    user.value = fetchedUser;
    form.firstName = fetchedUser.firstName;
    form.lastName = fetchedUser.lastName;
    form.address.street = fetchedUser.address.street;
    form.address.zipCode = fetchedUser.address.zipCode;
    selectedCountry.value = fetchedUser.address.city.state.country.countryId;
    selectedState.value = fetchedUser.address.city.state.stateId;
    form.address.city.cityId = fetchedUser.address.city.cityId;
    fetchStates();
    fetchCities();
  } catch (error) {
    console.error("Error fetching User:", error);
  }
};

onBeforeMount(() => {
  if (userToken.value == true) {
    fetchProfile();
    fetchCountries();
  }
});

// Handle Update Profile Logic
const form = reactive({
  firstName: "",
  lastName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
    },
  },
});

const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);

const fetchCountries = async () => {
  try {
    const data = await $fetch(`http://localhost:8080/api/zoo/countries`);
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
    const data = await $fetch(`http://localhost:8080/api/zoo/state/${selectedCountry.value}`);
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
    const data = await $fetch(`http://localhost:8080/api/zoo/cities/${selectedState.value}`);
    cities.value = data;
  } catch (error) {
    console.error("Error fetching Cities:", error);
  }
};

const updateUser = async () => {
  try {
    await $fetch(`http://localhost:8080/api/zoo/user/${userId.value}`, {
      method: "PATCH",
      body: form,
    });
    alert("User profile updated successfully!");
    toggleUpdateModal();
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

onBeforeMount(() => {

  
});
</script>

