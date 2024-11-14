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
            {{ modalTitle }} Animal
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
          <Form @submit="emit('save')" class="space-y-4">
            <!-- First Name Field -->

            <div>
              <label
                for="AnimalName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Animal Name</label
              >
              <Field
                name="animalName"
                rules="alpha|required"
                v-model="props.fromData.animalName"
                type="text"
                id="animalName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
              <ErrorMessage
                name="animalName"
                class="text-red-600 text-sm mt-1"
              />
            </div>

            <div>
              <label
                for="animalType"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Animal Type</label
              >
              <Field
                name="animalType"
                rules="alpha|required"
                v-model="props.fromData.animalType"
                type="text"
                id="animaltype"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage
                name="animalType"
                class="text-red-600 text-sm mt-1"
              />
            </div>
            <!-- Buttons -->
            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {{ props.submitButtonLabel }}
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, Form, ErrorMessage } from "vee-validate";
const emit = defineEmits(["close", "save"]);
type formDataType = {
  animalName: string;
  animalType: string;
};
const props = defineProps<{
  fromData: formDataType;
  submitButtonLabel: string;
  modalTitle: string;
}>();
</script>
