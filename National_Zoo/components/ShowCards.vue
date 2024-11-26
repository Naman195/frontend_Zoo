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
            }"
          >
            {{ viewButtonLabel }}
          </nuxt-link>
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
const emit = defineEmits(["update", "delete"]);

const props = defineProps({
  entityData: {
    type: Object,
  },
  cardName: String,
  deleteButtonLabel: String,
  updateButtonLabel: String,
  viewButtonLabel: String,
});

// console.log("Zoo Object from Data is", props.entityData);
// console.log("Animal Object is", props.entityData);
</script>
