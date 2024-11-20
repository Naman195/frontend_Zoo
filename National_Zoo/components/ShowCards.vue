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
      <h2 class="mb-2 text-slate-800 text-xl font-bold">
        {{ props.entityData.zooName }}
      </h2>
      <p>
        <!-- <h3>{{ props.entityData.zooName }}</h3>  -->
        {{ props.entityData.address.street }}
        {{ props.entityData.address.city.cityName }}
        <!-- {{ zoo.address.street }}, {{ zoo.address.city.cityName }} -->
      </p>
    </div>
    <div class="px-4 pb-4 pt-0 mt-2">
      <div class="mb-2">
        <button
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-2"
          type="button"
        >
          <nuxt-link
            :to="{
              path: `/${cardName}/all${cardName}s?${cardName}Id=${entityData.id}`,
              query: { zooId: entityData.zooId },
            }"
          >
            View Zoo
          </nuxt-link>
        </button>
      </div>

      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mb-2 mr-2"
        type="button"
        @click="emit('delete', entityData.zooId)"
      >
        Delete Zoo
      </button>
      <button
        class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        @click="emit('update')"
      >
        Update Zoo
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["view", "update", "add", "delete"]);

const props = defineProps({
  entityData: {
    type: Object,
    required: true,
  },
  cardName: String,
});

console.log("Zoo Object from Data is", props.entityData);
</script>
