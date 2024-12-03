<!-- <template>
  <div
    class="cursor-pointer group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300"
  >
    <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
      <img
        class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110"
        src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
        alt="investment-seed-round"
      />
    </div>
    <div class="p-4">
      <h2
        v-if="props.entityData.zooId"
        class="mb-2 text-slate-800 text-xl font-bold"
      >
        {{ props.entityData.zooName }}
      </h2>
      <h2 v-else class="mb-2 text-slate-800 text-xl font-bold">
        {{ props.entityData.animalName }}
      </h2>

      <p v-if="props.entityData.zooId">
        {{ props.entityData.address.street }} ,
        {{ props.entityData.address.city.cityName }}
      </p>
      <p v-else>
        {{ props.entityData.animalType }}
      </p>
    </div>
    <div class="px-4 pb-4 pt-0 mt-2">
      <div class="mb-2">
        <button
          v-if="props.entityData.zooId"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-2"
          type="button"
        >
          <nuxt-link
            :to="{
              path: `/${cardName}/all${cardName}s?${cardName}Id=${entityData.id}`,
              query: { zooId: entityData.zooId },
            }"
          >
            {{ viewButtonLabel }}
          </nuxt-link>
        </button>

        <button
          v-else
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-2"
          type="button"
        >
          <nuxt-link
            :to="{
              path: `/animalprofile`,
              query: { id: entityData.animalId },
            }"
          >
            {{ viewButtonLabel }}
          </nuxt-link>
        </button>
        <button
          v-if="!props.entityData.zooId"
          @click="emit('transfer')"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Transfer Animal
        </button>
      </div>

      <button
        v-if="entityData.zooId"
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-2"
        type="button"
        @click="emit('delete', entityData.zooId)"
      >
        {{ deleteButtonLabel }}
      </button>
      <button
        v-else
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-2"
        type="button"
        @click="emit('delete')"
      >
        {{ deleteButtonLabel }}
      </button>
      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        @click="emit('update')"
      >
        {{ updateButtonLabel }}
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["update", "delete", "transfer"]);

const props = defineProps({
  entityData: {
    type: Object,
  },
  cardName: String,
  deleteButtonLabel: String,
  updateButtonLabel: String,
  viewButtonLabel: String,
});
</script> -->

<template>
  <div
    class="cursor-pointer group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300"
  >
    <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
      <img
        class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110"
        src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
        alt="investment-seed-round"
      />
    </div>
    <div class="p-4">
      <h2
        v-if="props.entityData.zooId"
        class="mb-2 text-slate-800 text-xl font-bold"
      >
        {{ props.entityData.zooName }}
      </h2>
      <h2 v-else class="mb-2 text-slate-800 text-xl font-bold">
        {{ props.entityData.animalName }}
      </h2>

      <p v-if="props.entityData.zooId">
        {{ props.entityData.address.street }} ,
        {{ props.entityData.address.city.cityName }}
      </p>
      <p v-else>
        {{ props.entityData.animalType }}
      </p>
    </div>
    <div class="flex justify-around items-center px-4 pb-4 pt-0 mt-2 space-x-4">
      <!-- View Icon -->
      <nuxt-link
        v-if="props.entityData.zooId"
        :to="{
          path: `/${cardName}/all${cardName}s?${cardName}Id=${entityData.id}`,
          query: { zooId: entityData.zooId },
        }"
        class="text-slate-800 hover:text-slate-600"
      >
        <i class="fas fa-eye text-xl"></i>
      </nuxt-link>
      <nuxt-link
        v-else
        :to="{ path: `/animalprofile`, query: { id: entityData.animalId } }"
        class="text-slate-800 hover:text-slate-600"
      >
        <i class="fas fa-eye text-xl"></i>
      </nuxt-link>

      <!-- Transfer Icon -->
      <i
        v-if="!props.entityData.zooId"
        @click="emit('transfer')"
        class="fas fa-exchange-alt text-xl cursor-pointer text-slate-800 hover:text-slate-600"
      ></i>

      <!-- Delete Icon -->
      <i
        v-if="entityData.zooId"
        @click="emit('delete', entityData.zooId)"
        class="fas fa-trash text-xl cursor-pointer text-slate-800 hover:text-slate-600"
      ></i>
      <i
        v-else
        @click="emit('delete')"
        class="fas fa-trash text-xl cursor-pointer text-slate-800 hover:text-slate-600"
      ></i>

      <!-- Update Icon -->
      <i
        @click="emit('update')"
        class="fas fa-edit text-xl cursor-pointer text-slate-800 hover:text-slate-600"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faTrash, faEdit, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEye, faTrash, faEdit, faExchangeAlt);

const emit = defineEmits(["update", "delete", "transfer"]);

const props = defineProps({
  entityData: {
    type: Object,
  },
  cardName: String,
  deleteButtonLabel: String,
  updateButtonLabel: String,
  viewButtonLabel: String,
});
</script>

<style scoped>
/* Optional: Add custom styles for icons if needed */
</style>

