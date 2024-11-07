<template>
  <div
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
            Add Zoo
          </h3>
          <button
            @click="emit('close')"
            type="button"
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
          <form @submit.prevent="addZoo" class="space-y-4">
            <!-- First Name Field -->
            <div>
              <label
                for="ZooName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Zoo Name</label
              >
              <input
                type="text"
                v-model="form.zooName"
                id="firstName"
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
              Add Zoo
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const token = useCookie("auth");
const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);

const form = reactive({
  zooName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
    },
  },
});

const fetchCountries = async () => {
  try {
    const data = await $fetch(`http://localhost:8080/api/auth/countries`);
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
    const data = await $fetch(
      `http://localhost:8080/api/auth/state/${selectedCountry.value}`
    );
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
    const data = await $fetch(
      `http://localhost:8080/api/auth/cities/${selectedState.value}`
    );
    cities.value = data;
  } catch (error) {
    console.error("Error fetching Cities:", error);
  }
};

const addZoo = async () => {
  const response = await $fetch(`http://localhost:8080/api/zoo/create-zoo`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    method: "POST",
    body: form,
  });
};

onBeforeMount(() => {
  fetchCountries();
});
</script>
