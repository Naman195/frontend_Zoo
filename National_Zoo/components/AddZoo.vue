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
            {{ modalTitle }}
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
          <Form
            @submit="
              () => {
                console.log('----------------------------->');
                console.log(props.fromData);
                emit('save', props.fromData);
              }
            "
            class="space-y-4"
          >
            <!-- First Name Field -->

            <div v-if="props.fromData.zooName">
              <label
                for="ZooName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Zoo Name</label
              >
              <Field
                name="zooName"
                rules="required|alpha_spaces"
                type="text"
                v-model="props.fromData.zooName"
                id="firstName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="zooName" class="text-red-600 text-sm mt-1" />
            </div>

            <div v-if="props.fromData.fullName">
              <label
                for="fullName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Full Name</label
              >
              <Field
                name="fullName"
                type="text"
                rules="required|alpha_spaces"
                v-model="props.fromData.fullName"
                id="fullName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
              <ErrorMessage name="fullName" class="text-red-600 text-sm mt-1" />
            </div>
            <!-- Country Select -->
            <div class="register-pair">
              <div>
                <label
                  for="country"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Country</label
                >
                <Field
                  name="country"
                  as="select"
                  rules="required"
                  v-model="selectedCountry"
                  @change="handleCountryChange"
                  id="country"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  ><option value="" disabled>Select Country</option>
                  <option
                    v-for="country in countries"
                    :key="country.countryId"
                    :value="country.countryId"
                  >
                    {{ country.countryName }}
                  </option>
                </Field>
                <ErrorMessage
                  name="country"
                  class="text-red-600 text-sm mt-1"
                />
              </div>
              <!-- State Select -->
              <div>
                <label
                  for="state"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >State</label
                >
                <Field
                  name="state"
                  as="select"
                  rules="required"
                  v-model="selectedState"
                  :disabled="!selectedCountry"
                  @change="handleStateChange"
                  id="state"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="" disabled>Select State</option>
                  <option
                    v-for="state in states"
                    :key="state.stateId"
                    :value="state.stateId"
                  >
                    {{ state.stateName }}
                  </option>
                </Field>
                <ErrorMessage name="state" class="text-red-600 text-sm mt-1" />
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
                <Field
                  name="city"
                  as="select"
                  rules="required"
                  v-model="props.fromData.address.city.cityId"
                  :disabled="!selectedState"
                  id="city"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="" disabled>Select City</option>
                  <option
                    v-for="city in cities"
                    :key="city.cityId"
                    :value="city.cityId"
                  >
                    {{ city.cityName }}
                  </option>
                </Field>
                <ErrorMessage name="city" class="text-red-600 text-sm mt-1" />
              </div>
              <!-- Street Input -->
              <div>
                <label
                  for="zipCode"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Zip Code</label
                >
                <Field
                  name="zipCode"
                  rules="required|digits:6"
                  v-model="props.fromData.address.zipCode"
                  type="text"
                  id="zipCode"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
                <ErrorMessage
                  name="zipCode"
                  class="text-red-600 text-sm mt-1"
                />
              </div>
            </div>

            <!-- Zip Code Input -->
            <div class="register-pair">
              <div>
                <label
                  for="street"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Street</label
                >
                <Field
                  name="street"
                  rules="required|alpha_spaces"
                  v-model="props.fromData.address.street"
                  type="text"
                  id="street"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
                <ErrorMessage name="street" class="text-red-600 text-sm mt-1" />
              </div>

              <div>
                <label
                  for="image"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Upload Image</label
                >
                <Field
                  name="image"
                  v-model="props.fromData.image"
                  type="file"
                  id="image"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  @change="
                    (e) => {
                      console.log(e.target.files[0].name);
                      console.log(props.fromData.image);
                    }
                  "
                />
                <ErrorMessage name="image" class="text-red-600 text-sm mt-1" />
              </div>
            </div>

            <!-- Buttons -->
            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {{ submitButtonLabel }}
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, Field, Form } from "vee-validate";
import type { City } from "~/types/City";
import type { Country } from "~/types/Country";
import type { State } from "~/types/State";
import type { Zoo } from "~/types/Zoo";

const emit = defineEmits(["close", "save", "updateData", "handleImageUpload"]);

const props = defineProps<{
  fromData: Zoo;
  submitButtonLabel: string;
  modalTitle: string;
  updateClick: boolean;
}>();

console.log("From Data", props.fromData);

const countries = ref<Country[]>([]);
const states = ref<State[]>([]);
const cities = ref<City[]>([]);
const selectedCountry = ref<number | null>(null);
const selectedState = ref<number | null>(null);
const formData = ref({ ...props.fromData });

console.log("From Data2", formData.value);

onMounted(() => {
  fetchCountries();
  initializeSelections();
});

const fetchCountries = async () => {
  const data = await $fetch<Country[]>(`http://localhost:8080/country/all`);
  countries.value = data;
};

const initializeSelections = async () => {
  selectedCountry.value = formData.value.address.city.state.country.countryId;
  await fetchStates();
  selectedState.value = formData.value.address.city.state.stateId;
  await fetchCities();
};

const handleCountryChange = () => selectedCountry.value && fetchStates();
const fetchStates = async () => {
  if (selectedCountry.value) {
    const data = await $fetch<State[]>(
      `http://localhost:8080/state/${selectedCountry.value}`
    );
    states.value = data;
  }
};

const handleStateChange = () => selectedState.value && fetchCities();
const fetchCities = async () => {
  if (selectedState.value) {
    const data = await $fetch<City[]>(
      `http://localhost:8080/city/${selectedState.value}`
    );
    cities.value = data;
  }
};
</script>
