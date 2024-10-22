<!-- <template>

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


</template> -->