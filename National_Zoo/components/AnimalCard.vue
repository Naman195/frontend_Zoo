<template>
  <ShowCards>
    <template #card-image>
      <div class="relative w-full h-[200px] overflow-hidden">
        <img
          class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110 w-full h-full object-cover"
          :src="imageUrl"
          alt="Zoo Image"
        />
      </div>
    </template>
    <template #card-title>
      <h2 class="mb-2 text-slate-800 text-xl font-bold">
        {{ props.entityData.animalName }}
      </h2>
    </template>
    <template #card-subtitle>
      <p class="truncate whitespace-nowrap overflow-hidden">
        {{ props.entityData.animalType }}
      </p>
    </template>
    <template #card-action>
      <nuxt-link
        :to="{ path: `/animalprofile`, query: { id: entityData.animalId } }"
        class="text-slate-800 hover:text-slate-600"
      >
        <i class="fas fa-eye text-xl" title="View History"></i>
      </nuxt-link>

      <!-- Transfer -->
      <i
        v-if="useAuth().isAdmin"
        @click="emit('transfer')"
        class="fas fa-exchange-alt text-xl cursor-pointer text-blue-500 hover:text-blue-700"
        title="Transfer Animal"
      ></i>
      <!-- Delete -->

      <i
        v-if="useAuth().isAdmin"
        @click="emit('delete')"
        class="fas fa-trash text-xl cursor-pointer text-red-600 hover:text-red-700"
        title="Delete Animal"
      ></i>

      <!-- Update -->
      <i
        v-if="useAuth().isAdmin"
        @click="emit('update')"
        class="fas fa-edit text-xl cursor-pointer text-slate-800 hover:text-slate-600"
        title="Update Animal"
      ></i>
    </template>
  </ShowCards>
</template>

<script lang="ts" setup>
import type { Animal } from "~/types/Animal";

const props = defineProps<{
  entityData: Animal;
}>();

const emit = defineEmits<{
  (e: "update"): void;
  (e: "delete"): void;
  (e: "transfer"): void;
}>();

var imageUrl = `http://192.168.1.33:8081/${props.entityData.image}`;
</script>
