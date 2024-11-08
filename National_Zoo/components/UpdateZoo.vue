<template>
  <div
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Update Zoo Details
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
          <form @submit.prevent="updateZoo" class="space-y-4">
            <!-- First Name Field -->

            <div>
              <label
                for="ZooName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Zoo Name</label
              >
              <input
                v-model="props.zoo.zooName"
                type="text"
                id="firstName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <!-- Country Select -->
            <div class="register-pair">
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
            </div>
            <!-- City Select -->
            <div class="register-pair">
              <div>
                <label
                  for="city"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >City</label
                >
                <select
                  v-model="selectedCity"
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
                  for="zipCode"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Zip Code</label
                >
                <input
                  v-model="props.zoo.address.zipCode"
                  type="text"
                  id="zipCode"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
            </div>

            <!-- Zip Code Input -->
            <div>
              <label
                for="street"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Street</label
              >
              <input
                v-model="props.zoo.address.street"
                type="text"
                id="street"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <!-- Buttons -->
            <button
              @click="emit('updateZoo')"
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update Zoo
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close", "updateZoo"]);
const props = defineProps({
  zoo: {
    type: Object,
    required: true,
  },
});

console.log("Zoo Objext Is", props.zoo.zooName);
console.log("Zoo Country Is", props.zoo.address.city.cityName);
console.log("Zoo Country Is", props.zoo.address.city.state.stateName);
console.log("Zoo Country Is", props.zoo.address.city.state.country.countryName);

const token = useCookie("auth");
const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);
const selectedCity = ref(null);
let zooId = null;
zooId = props.zoo.zooId;
console.log("ZooId Is", zooId);

selectedCountry.value = props.zoo.address.city.state.country.countryId;
selectedState.value = props.zoo.address.city.state.stateId;
selectedCity.value = props.zoo.address.city.cityId;

const fetchCountries = async () => {
  try {
    const data = await $fetch(`http://localhost:8080/api/auth/countries`);
    countries.value = data;
    // Fetch states after setting the selected country
    if (selectedCountry.value) {
      await fetchStates();
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const handleCountryChange = async () => {
  if (selectedCountry.value) {
    await fetchStates();
    // Reset selectedState and selectedCity when country changes
    selectedState.value = null;
    selectedCity.value = null;
  }
};

const fetchStates = async () => {
  if (!selectedCountry.value) return;
  try {
    const data = await $fetch(
      `http://localhost:8080/api/auth/state/${selectedCountry.value}`
    );
    states.value = data;

    // If there is a previously selected state, set it
    if (props.zoo.address.city.state) {
      selectedState.value = props.zoo.address.city.state.stateId;
      // Fetch cities after setting the selected state
      await fetchCities();
    }
  } catch (error) {
    console.error("Error fetching States:", error);
  }
};

const handleStateChange = async () => {
  if (selectedState.value) {
    await fetchCities();
  }
};

const fetchCities = async () => {
  if (!selectedState.value) return;
  try {
    const data = await $fetch(
      `http://localhost:8080/api/auth/cities/${selectedState.value}`
    );
    cities.value = data;

    // If there is a previously selected city, set it
    if (props.zoo.address.city) {
      selectedCity.value = props.zoo.address.city.cityId;
    }
  } catch (error) {
    console.error("Error fetching Cities:", error);
  }
};

const updateZoo = async () => {
  const body = {
    zooName: props.zoo.zooName,
    address: {
      street: props.zoo.address.street,
      zipCode: props.zoo.address.zipCode,
      city: {
        cityId: selectedCity.value,
      },
    },
  };
  try {
    const response = await $fetch(
      `http://localhost:8080/api/zoo/update/${zooId}`,
      {
        method: "PATCH",
        body: body,
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("response", response);
    emit("close");

    // if (response.success) {
    //   console.log("Zoo updated successfully:", response.data);
    //
    // } else {
    //   console.error("Update failed:", response.message);
    // }
  } catch (error) {
    console.error("Error updating zoo:", error);
  }
};

onBeforeMount(() => {
  fetchCountries();
});
</script>
