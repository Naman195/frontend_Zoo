<template>
  <ShowCards>
    <template #card-image>
      <div id="myDiv">
        <img
          class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110 w-full h-full object-cover"
          :src="imageUrl"
          alt="Zoo Image"
        />
      </div>
    </template>
    <template #card-title>
      <h2 class="mb-2 text-slate-800 text-xl font-bold">
        {{ props.entityData.zooName }}
      </h2>
    </template>
    <template #card-subtitle>
      <p class="truncate whitespace-nowrap overflow-hidden">
        {{ props.entityData?.address?.street }} ,
        {{ props.entityData?.address?.city.cityName }}
      </p>
    </template>
    <template #card-action>
      <nuxt-link
        :to="{
          path: `/animal/allanimals`,
          query: { zooId: entityData.zooId, zooName: entityData.zooName },
        }"
        class="text-slate-800 hover:text-slate-600"
      >
        <i class="fas fa-eye text-xl" title="View Zoo"></i>
      </nuxt-link>

      <!-- Delete -->

      <i
        v-if="useAuth().isAdmin"
        @click="emit('delete', entityData.zooId)"
        class="fas fa-trash text-xl cursor-pointer text-red-600 hover:text-red-700"
        title="Delete Zoo"
      ></i>

      <!-- Update -->
      <i
        v-if="useAuth().isAdmin"
        @click="emit('update')"
        class="fas fa-edit text-xl cursor-pointer text-slate-800 hover:text-slate-600"
        title="Update Zoo"
      ></i>
    </template>
  </ShowCards>
</template>

<script lang="ts" setup>
import type { Zoo } from "~/types/Zoo";
import type { Address } from "~/types/Address";

interface Entity {
  zoo?: Zoo;
  image?: string;
  address?: Address;
  zooId?: number;
  zooName?: string;
}

const props = defineProps<{
  entityData: Entity;
}>();

const emit = defineEmits<{
  (e: "update"): void;
  (e: "delete", zooId?: number): void;
}>();

var imageUrl = `http://192.168.0.153:8081/${props.entityData.image}`;
console.log("Image Url", imageUrl);
console.log("Props Image", props.entityData.image);
</script>
