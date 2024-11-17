<template>
  <div v-if="deletedAert" class="z-50 absolute top-1/2">
    <ShowAlert
      :alert-message="'User Deleted Successfully'"
      @close-modal="deletedAertClose"
    />
  </div>
  <div v-if="updateAlert">
    <ShowAlert
      :alert-message="'User Updated  Successfully'"
      @close-modal="closeUpdateAlert"
    />
  </div>

  <div class="card-grid">
    <div v-if="openModal" class="z-50 absolute top-1/2">
      <Modal
        :message="'User'"
        @delete-user="deleteUserApi"
        @close-modal="openModal = false"
      />
    </div>
    <div class="card" v-for="user in filteredUsers" :key="user.userId">
      <div class="card-body">
        <h5 class="card-title">{{ user.firstName }} {{ user.lastName }}</h5>
        <p class="card-text">{{ user.userId }}</p>
        <p class="card-text">{{ user.address.zipCode }}</p>
        <div class="flex justify-between mt-4">
          <button
            class="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
            @click="
              () => {
                getUserId(user);
                fetchProfile().then(() => {
                  toggleUpdateModal();
                  fetchCountries();
                });
              }
            "
          >
            Update
          </button>
          <button
            @click="
              () => {
                getUserId(user);
                openModal = true;
              }
            "
            class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- .... MOdal for Update .... -->

    <div
      v-if="isUpdateModalVisible"
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Update Profile
            </h3>
            <button
              type="button"
              @click="toggleUpdateModal"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5 max-h-[60vh] overflow-y-auto">
            <form @submit.prevent="updateUser" class="space-y-4">
              <!-- First Name Field -->
              <div>
                <label
                  for="firstName"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >First Name</label
                >
                <input
                  type="text"
                  v-model="form.firstName"
                  id="firstName"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <!-- Last Name Field -->
              <div>
                <label
                  for="lastName"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Last Name</label
                >
                <input
                  type="text"
                  v-model="form.lastName"
                  id="lastName"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <!-- Country Select -->
              <div>
                <label
                  for="country"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Country</label
                >
                <select
                  v-model="selectedCountry"
                  @change="handleCountryChange"
                  id="country"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option
                    v-for="country in countries"
                    :key="country.countryId"
                    :value="country.countryId"
                  >
                    {{ country.countryName }}
                  </option>
                </select>
              </div>
              <!-- State Select -->
              <div>
                <label
                  for="state"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >State</label
                >
                <select
                  v-model="selectedState"
                  @change="handleStateChange"
                  id="state"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option
                    v-for="state in states"
                    :key="state.stateId"
                    :value="state.stateId"
                  >
                    {{ state.stateName }}
                  </option>
                </select>
              </div>
              <!-- City Select -->
              <div>
                <label
                  for="city"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >City</label
                >
                <select
                  v-model="form.address.city.cityId"
                  id="city"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option
                    v-for="city in cities"
                    :key="city.cityId"
                    :value="city.cityId"
                  >
                    {{ city.cityName }}
                  </option>
                </select>
              </div>
              <!-- Street Input -->
              <div>
                <label
                  for="street"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Street</label
                >
                <input
                  type="text"
                  v-model="form.address.street"
                  id="street"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <!-- Zip Code Input -->
              <div>
                <label
                  for="zipCode"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Zip Code</label
                >
                <input
                  type="text"
                  v-model="form.address.zipCode"
                  id="zipCode"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <!-- Buttons -->
              <button
                type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "../assests/css/AllUsers.css";

const isUpdateModalVisible = ref(false);
const userId = ref(null);
// const userID = useCookie("userId");
const user = ref(null);
const token = useCookie("auth");
const updateAlert = ref(false);

const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);

const openModal = ref(false);
const userLoggedInId = useCookie("userId");

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

const afterUpdate = () => {
  updateAlert.value = true;
};

const closeUpdateAlert = () => {
  updateAlert.value = false;
};

const getUserId = (user) => {
  userId.value = user.userId;
  console.log("Delete User Id", userId.value);
};

const deleteUserApi = () => {
  deleteUser();
  openModal.value = false;
};

const toggleUpdateModal = () => {
  isUpdateModalVisible.value = !isUpdateModalVisible.value;
};

const fetchProfile = async () => {
  try {
    const fetchedUser = await useCustomFetch(`/auth/user/${userId.value}`);
    user.value = fetchedUser;
    form.firstName = fetchedUser.firstName;
    form.lastName = fetchedUser.lastName;
    form.address.street = fetchedUser.address.street;
    form.address.zipCode = fetchedUser.address.zipCode;
    selectedCountry.value = fetchedUser.address.city.state.country.countryId;
    selectedState.value = fetchedUser.address.city.state.stateId;
    form.address.city.cityId = fetchedUser.address.city.cityId;
    await fetchStates();
    await fetchCities();
  } catch (error) {
    console.error("Error fetching User:", error);
  }
};

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
    // alert("User profile updated successfully!");
    afterUpdate();
    fetchUsers();
    // fetchProfile();
    toggleUpdateModal();
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

const users = ref([]);

const filteredUsers = ref([]);

const fetchUsers = async () => {
  try {
    const data = await useCustomFetch("/auth/allusers");
    users.value = data;

    filteredUsers.value = users.value.filter(
      (user) => user.userId !== userLoggedInId.value
    );
    // fetchProfile();
    // console.log(filteredUsers.value);
  } catch (error) {
    console.error("Error fetching Users:", error);
  }
};
const deletedAert = ref(false);
const afterDelete = () => {
  deletedAert.value = true;
};

const deletedAertClose = () => {
  deletedAert.value = false;
};

const deleteUser = async () => {
  try {
    const deleteUser = await useCustomFetch(
      `/auth/user/delete/${userId.value}`,
      {
        method: "PATCH",
      }
    );
    fetchUsers();
    afterDelete();

    //alert(deleteUser);
    console.log("Data Deleted");
  } catch (error) {
    alert("error in deleting the User", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
