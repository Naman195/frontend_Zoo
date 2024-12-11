<template>
 <div
  class="cursor-pointer group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300 max-h-[600px] overflow-hidden"
>
  <div class="relative h-50 m-2.5 overflow-hidden text-white rounded-md">
    <img
      class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110 w-full h-full object-cover"
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

    <p
      v-if="props.entityData.zooId"
      class="truncate whitespace-nowrap overflow-hidden"
    >
      {{ props.entityData?.address?.street }} ,
      {{ props.entityData?.address?.city.cityName }}
    </p>
    <p v-else class="truncate whitespace-nowrap overflow-hidden">
      {{ props.entityData.animalType }}
    </p>
  </div>

  <div class="flex justify-around items-center px-4 pb-4 pt-0 mt-2 space-x-4">
    <!-- View -->
    <nuxt-link
      v-if="props.entityData.zooId"
      :to="{
        path: `/${cardName}/all${cardName}s`,
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

    <!-- Transfer -->
    <i
      v-if="!props.entityData.zooId && isAdmin"
      @click="emit('transfer')"
      class="fas fa-exchange-alt text-xl cursor-pointer text-blue-500 hover:text-blue-700"
    ></i>

    <!-- Delete -->
    <div v-if="isAdmin">
      <i
        v-if="entityData.zooId"
        @click="emit('delete', entityData.zooId)"
        class="fas fa-trash text-xl cursor-pointer text-red-600 hover:text-red-700"
      ></i>
      <i
        v-else
        @click="emit('delete')"
        class="fas fa-trash text-xl cursor-pointer text-red-600 hover:text-red-700"
      ></i>
    </div>

    <!-- Update -->
    <i
      v-if="isAdmin"
      @click="emit('update')"
      class="fas fa-edit text-xl cursor-pointer text-slate-800 hover:text-slate-600"
    ></i>
  </div>
</div>

</template>

<script setup lang="ts">
import {
  faEye,
  faTrash,
  faEdit,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import type { Address } from "~/types/Address";
import type { Zoo } from "~/types/Zoo";
library.add(faEye, faTrash, faEdit, faExchangeAlt);

interface Entity {
  animalId?: string;
  animalName?: string;
  animalType?: string;
  zoo?: Zoo;
  address?: Address;
  zooId?: number;
  zooName?: string;
}


const props = defineProps<{
  entityData: Entity;
  cardName: string;
  deleteButtonLabel: string;
  updateButtonLabel: string;
  viewButtonLabel: string;
}>();

const emit = defineEmits<{
  (e: "update"): void;
  (e: "delete", zooId?: number): void;
  (e: "transfer"): void;
}>();

const isAdmin = ref(false);
const token = useCookie("auth");

const decodeJWT = (token: string | undefined) => {
  if (!token) return null;
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));

  return decodedPayload;
};

const decodedToken = decodeJWT(token?.value ?? undefined);
if (decodedToken && decodedToken.role === "admin") {
  isAdmin.value = true;
}
</script>
